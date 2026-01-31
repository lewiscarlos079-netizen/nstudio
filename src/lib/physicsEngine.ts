// Physics Engine - Destructible environments, collisions, forces
// Optimized for 144Hz, 16GB RAM, RTX hardware

export interface PhysicsBody {
  id: string;
  position: [number, number, number];
  velocity: [number, number, number];
  acceleration: [number, number, number];
  mass: number;
  restitution: number; // Bounciness (0-1)
  friction: number;
  isStatic: boolean;
  isDestructible: boolean;
  health: number; // For destructibles
  collisionGroup: number;
}

export interface PhysicsWorld {
  gravity: [number, number, number];
  bodies: Map<string, PhysicsBody>;
  constraints: PhysicsConstraint[];
  timestep: number; // Fixed timestep for simulation
  substeps: number; // Substeps per frame for stability
}

export interface PhysicsConstraint {
  id: string;
  type: 'distance' | 'hinge' | 'spring' | 'fixed';
  bodyA: string;
  bodyB: string;
  anchorA: [number, number, number];
  anchorB: [number, number, number];
  stiffness: number;
  damping: number;
}

export interface CollisionEvent {
  bodyA: string;
  bodyB: string;
  point: [number, number, number];
  normal: [number, number, number];
  impulse: number;
}

export interface DestructionEvent {
  bodyId: string;
  impactForce: number;
  fragments: PhysicsBody[];
}

// Vector math helpers
const vec3 = {
  add: (a: [number, number, number], b: [number, number, number]): [number, number, number] => 
    [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  
  sub: (a: [number, number, number], b: [number, number, number]): [number, number, number] => 
    [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  
  scale: (v: [number, number, number], s: number): [number, number, number] => 
    [v[0] * s, v[1] * s, v[2] * s],
  
  dot: (a: [number, number, number], b: [number, number, number]): number => 
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  
  length: (v: [number, number, number]): number => 
    Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]),
  
  normalize: (v: [number, number, number]): [number, number, number] => {
    const len = vec3.length(v);
    return len > 0 ? vec3.scale(v, 1 / len) : [0, 0, 0];
  },
  
  cross: (a: [number, number, number], b: [number, number, number]): [number, number, number] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ],
};

// Create physics world
export function createPhysicsWorld(): PhysicsWorld {
  return {
    gravity: [0, -9.81, 0],
    bodies: new Map(),
    constraints: [],
    timestep: 1 / 144, // 144Hz target
    substeps: 4,
  };
}

// Create physics body
export function createPhysicsBody(
  id: string,
  position: [number, number, number],
  options: Partial<PhysicsBody> = {}
): PhysicsBody {
  return {
    id,
    position,
    velocity: [0, 0, 0],
    acceleration: [0, 0, 0],
    mass: options.mass ?? 1,
    restitution: options.restitution ?? 0.3,
    friction: options.friction ?? 0.5,
    isStatic: options.isStatic ?? false,
    isDestructible: options.isDestructible ?? false,
    health: options.health ?? 100,
    collisionGroup: options.collisionGroup ?? 1,
  };
}

// Add body to world
export function addBody(world: PhysicsWorld, body: PhysicsBody): void {
  world.bodies.set(body.id, body);
}

// Remove body from world
export function removeBody(world: PhysicsWorld, id: string): void {
  world.bodies.delete(id);
}

// Apply force to body
export function applyForce(
  world: PhysicsWorld,
  bodyId: string,
  force: [number, number, number]
): void {
  const body = world.bodies.get(bodyId);
  if (body && !body.isStatic) {
    // F = ma, so a = F/m
    const accel = vec3.scale(force, 1 / body.mass);
    body.acceleration = vec3.add(body.acceleration, accel);
  }
}

// Apply impulse (instant velocity change)
export function applyImpulse(
  world: PhysicsWorld,
  bodyId: string,
  impulse: [number, number, number]
): void {
  const body = world.bodies.get(bodyId);
  if (body && !body.isStatic) {
    // Impulse = mass * deltaV, so deltaV = impulse / mass
    const deltaV = vec3.scale(impulse, 1 / body.mass);
    body.velocity = vec3.add(body.velocity, deltaV);
  }
}

// Simple sphere-sphere collision detection
function detectSphereCollision(
  bodyA: PhysicsBody,
  bodyB: PhysicsBody,
  radiusA: number = 0.5,
  radiusB: number = 0.5
): CollisionEvent | null {
  const diff = vec3.sub(bodyB.position, bodyA.position);
  const distance = vec3.length(diff);
  const minDist = radiusA + radiusB;
  
  if (distance < minDist && distance > 0) {
    const normal = vec3.normalize(diff);
    const penetration = minDist - distance;
    
    // Calculate relative velocity
    const relVel = vec3.sub(bodyB.velocity, bodyA.velocity);
    const velAlongNormal = vec3.dot(relVel, normal);
    
    // Only collide if objects are approaching
    if (velAlongNormal < 0) {
      return null;
    }
    
    const restitution = Math.min(bodyA.restitution, bodyB.restitution);
    const impulse = -(1 + restitution) * velAlongNormal;
    const totalMass = bodyA.mass + bodyB.mass;
    
    return {
      bodyA: bodyA.id,
      bodyB: bodyB.id,
      point: vec3.add(bodyA.position, vec3.scale(normal, radiusA)),
      normal,
      impulse: impulse / totalMass,
    };
  }
  
  return null;
}

// Resolve collision
function resolveCollision(
  world: PhysicsWorld,
  collision: CollisionEvent
): DestructionEvent | null {
  const bodyA = world.bodies.get(collision.bodyA);
  const bodyB = world.bodies.get(collision.bodyB);
  
  if (!bodyA || !bodyB) return null;
  
  const impulseVec = vec3.scale(collision.normal, collision.impulse);
  
  if (!bodyA.isStatic) {
    bodyA.velocity = vec3.sub(bodyA.velocity, vec3.scale(impulseVec, 1 / bodyA.mass));
  }
  
  if (!bodyB.isStatic) {
    bodyB.velocity = vec3.add(bodyB.velocity, vec3.scale(impulseVec, 1 / bodyB.mass));
  }
  
  // Check for destruction
  const impactForce = Math.abs(collision.impulse);
  
  if (bodyA.isDestructible && impactForce > 50) {
    bodyA.health -= impactForce;
    if (bodyA.health <= 0) {
      return createDestruction(world, bodyA, impactForce);
    }
  }
  
  if (bodyB.isDestructible && impactForce > 50) {
    bodyB.health -= impactForce;
    if (bodyB.health <= 0) {
      return createDestruction(world, bodyB, impactForce);
    }
  }
  
  return null;
}

// Create destruction fragments (e.g., wall crumbling)
function createDestruction(
  world: PhysicsWorld,
  body: PhysicsBody,
  impactForce: number
): DestructionEvent {
  const fragmentCount = Math.min(Math.floor(impactForce / 10), 12);
  const fragments: PhysicsBody[] = [];
  
  for (let i = 0; i < fragmentCount; i++) {
    const angle = (i / fragmentCount) * Math.PI * 2;
    const offset: [number, number, number] = [
      Math.cos(angle) * 0.3,
      Math.random() * 0.5,
      Math.sin(angle) * 0.3
    ];
    
    const fragment = createPhysicsBody(
      `${body.id}_fragment_${i}`,
      vec3.add(body.position, offset),
      {
        mass: body.mass / fragmentCount,
        restitution: 0.2,
        isDestructible: false,
      }
    );
    
    // Give fragments outward velocity
    fragment.velocity = vec3.scale(offset, impactForce * 0.5);
    fragment.velocity[1] += Math.random() * 5;
    
    fragments.push(fragment);
  }
  
  // Remove original body
  removeBody(world, body.id);
  
  // Add fragments
  fragments.forEach(f => addBody(world, f));
  
  return {
    bodyId: body.id,
    impactForce,
    fragments,
  };
}

// Main physics step
export function stepPhysics(
  world: PhysicsWorld,
  deltaTime: number
): { collisions: CollisionEvent[]; destructions: DestructionEvent[] } {
  const collisions: CollisionEvent[] = [];
  const destructions: DestructionEvent[] = [];
  
  const substepDt = deltaTime / world.substeps;
  
  for (let step = 0; step < world.substeps; step++) {
    // Apply gravity
    world.bodies.forEach(body => {
      if (!body.isStatic) {
        body.acceleration = vec3.add(body.acceleration, world.gravity);
      }
    });
    
    // Integrate velocities and positions
    world.bodies.forEach(body => {
      if (!body.isStatic) {
        // Update velocity: v += a * dt
        body.velocity = vec3.add(body.velocity, vec3.scale(body.acceleration, substepDt));
        
        // Apply drag
        body.velocity = vec3.scale(body.velocity, 0.995);
        
        // Update position: p += v * dt
        body.position = vec3.add(body.position, vec3.scale(body.velocity, substepDt));
        
        // Ground collision (simple floor at y=0)
        if (body.position[1] < 0.5) {
          body.position[1] = 0.5;
          body.velocity[1] = -body.velocity[1] * body.restitution;
          body.velocity[0] *= (1 - body.friction);
          body.velocity[2] *= (1 - body.friction);
        }
        
        // Clear acceleration
        body.acceleration = [0, 0, 0];
      }
    });
    
    // Detect and resolve collisions
    const bodyArray = Array.from(world.bodies.values());
    for (let i = 0; i < bodyArray.length; i++) {
      for (let j = i + 1; j < bodyArray.length; j++) {
        const collision = detectSphereCollision(bodyArray[i], bodyArray[j]);
        if (collision) {
          collisions.push(collision);
          const destruction = resolveCollision(world, collision);
          if (destruction) {
            destructions.push(destruction);
          }
        }
      }
    }
  }
  
  return { collisions, destructions };
}

// Create destructible wall
export function createDestructibleWall(
  world: PhysicsWorld,
  position: [number, number, number],
  size: [number, number, number]
): string[] {
  const ids: string[] = [];
  const bricksX = Math.ceil(size[0] / 0.5);
  const bricksY = Math.ceil(size[1] / 0.3);
  const bricksZ = Math.ceil(size[2] / 0.25);
  
  for (let x = 0; x < bricksX; x++) {
    for (let y = 0; y < bricksY; y++) {
      for (let z = 0; z < bricksZ; z++) {
        const id = `wall_brick_${x}_${y}_${z}`;
        const brickPos: [number, number, number] = [
          position[0] + x * 0.5 - (bricksX * 0.5) / 2,
          position[1] + y * 0.3,
          position[2] + z * 0.25 - (bricksZ * 0.25) / 2,
        ];
        
        const brick = createPhysicsBody(id, brickPos, {
          mass: 2,
          isDestructible: true,
          health: 50 + Math.random() * 30,
          restitution: 0.1,
          friction: 0.8,
        });
        
        addBody(world, brick);
        ids.push(id);
      }
    }
  }
  
  return ids;
}

// Export physics hook for React
export function usePhysicsWorld() {
  const world = createPhysicsWorld();
  
  return {
    world,
    addBody: (body: PhysicsBody) => addBody(world, body),
    removeBody: (id: string) => removeBody(world, id),
    applyForce: (id: string, force: [number, number, number]) => applyForce(world, id, force),
    applyImpulse: (id: string, impulse: [number, number, number]) => applyImpulse(world, id, impulse),
    step: (dt: number) => stepPhysics(world, dt),
    createWall: (pos: [number, number, number], size: [number, number, number]) => 
      createDestructibleWall(world, pos, size),
  };
}
