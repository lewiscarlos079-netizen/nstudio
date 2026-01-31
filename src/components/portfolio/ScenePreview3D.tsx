import { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

import { HumanoidCharacter } from './preview-models/HumanoidCharacter';
import { BossCreature } from './preview-models/BossCreature';
import { GamePlayer } from './preview-models/GamePlayer';
import { EnvironmentScene } from './preview-models/EnvironmentElements';
import { ActionScene } from './preview-models/ActionEffects';
import { ProductShowcase } from './preview-models/ProductShowcase';

interface ScenePreview3DProps {
  sceneIndex: number;
  projectType?: string;
  isPlaying: boolean;
}

// Scene selector based on project type and scene index
function SceneContent({ sceneIndex, projectType, isPlaying }: ScenePreview3DProps) {
  const scenes = useMemo(() => {
    switch (projectType) {
      case 'movie-3d':
        return [
          <EnvironmentScene key={0} isPlaying={isPlaying} />,
          <HumanoidCharacter key={1} isPlaying={isPlaying} variant="hero" />,
          <ActionScene key={2} isPlaying={isPlaying} />,
          <HumanoidCharacter key={3} isPlaying={isPlaying} variant="warrior" />,
        ];
      case 'game':
        return [
          <GamePlayer key={0} isPlaying={isPlaying} />,
          <GamePlayer key={1} isPlaying={isPlaying} />,
          <BossCreature key={2} isPlaying={isPlaying} />,
          <ProductShowcase key={3} isPlaying={isPlaying} />,
        ];
      default:
        return [
          <ProductShowcase key={0} isPlaying={isPlaying} />,
          <HumanoidCharacter key={1} isPlaying={isPlaying} />,
          <EnvironmentScene key={2} isPlaying={isPlaying} />,
        ];
    }
  }, [projectType, isPlaying]);

  return scenes[sceneIndex % scenes.length] || <ProductShowcase isPlaying={isPlaying} />;
}

export function ScenePreview3D({ sceneIndex, projectType, isPlaying }: ScenePreview3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 4], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#a78bfa" />
      
      <Suspense fallback={null}>
        <SceneContent sceneIndex={sceneIndex} projectType={projectType} isPlaying={isPlaying} />
      </Suspense>
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={isPlaying}
        autoRotateSpeed={1}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
      <Environment preset="city" />
    </Canvas>
  );
}
