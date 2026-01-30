import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionTier = 'free' | 'club' | 'pro';

export interface ClubBenefit {
  id: string;
  name: string;
  description: string;
  type: 'character' | 'gear' | 'set' | 'creature' | 'vehicle';
  exclusiveUntil?: Date;
}

export interface VoteOption {
  id: string;
  name: string;
  description: string;
  category: string;
  votes: number;
  thumbnail?: string;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  bonusPoints: number;
  pointsHistory: { date: Date; amount: number; reason: string }[];
  monthlyVotes: VoteOption[];
  userVotedFor: string[];
  
  // Actions
  setTier: (tier: SubscriptionTier) => void;
  addBonusPoints: (amount: number, reason: string) => void;
  spendBonusPoints: (amount: number) => boolean;
  voteFor: (optionId: string) => void;
  hasVotedFor: (optionId: string) => boolean;
}

// Sample monthly vote options
const defaultVoteOptions: VoteOption[] = [
  {
    id: 'dragon-mount',
    name: 'Dragon Mount',
    description: 'Rideable dragon with fire-breathing animations',
    category: 'creature',
    votes: 234,
  },
  {
    id: 'samurai-armor',
    name: 'Samurai Armor Set',
    description: 'Full feudal Japan warrior gear with sword',
    category: 'gear',
    votes: 189,
  },
  {
    id: 'underwater-temple',
    name: 'Underwater Temple',
    description: 'Mystical sunken ruins with coral details',
    category: 'set',
    votes: 156,
  },
  {
    id: 'cyber-ninja',
    name: 'Cyber Ninja Character',
    description: 'Futuristic ninja with holographic weapons',
    category: 'character',
    votes: 312,
  },
];

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      tier: 'free',
      bonusPoints: 0,
      pointsHistory: [],
      monthlyVotes: defaultVoteOptions,
      userVotedFor: [],

      setTier: (tier) => {
        set({ tier });
        // Award welcome bonus for club members
        if (tier === 'club') {
          get().addBonusPoints(500, 'Welcome to the Club!');
        }
      },

      addBonusPoints: (amount, reason) =>
        set((state) => ({
          bonusPoints: state.bonusPoints + amount,
          pointsHistory: [
            ...state.pointsHistory,
            { date: new Date(), amount, reason },
          ],
        })),

      spendBonusPoints: (amount) => {
        const { bonusPoints } = get();
        if (bonusPoints >= amount) {
          set((state) => ({
            bonusPoints: state.bonusPoints - amount,
            pointsHistory: [
              ...state.pointsHistory,
              { date: new Date(), amount: -amount, reason: 'Points redeemed' },
            ],
          }));
          return true;
        }
        return false;
      },

      voteFor: (optionId) =>
        set((state) => {
          if (state.userVotedFor.includes(optionId)) return state;
          return {
            userVotedFor: [...state.userVotedFor, optionId],
            monthlyVotes: state.monthlyVotes.map((option) =>
              option.id === optionId
                ? { ...option, votes: option.votes + 1 }
                : option
            ),
          };
        }),

      hasVotedFor: (optionId) => get().userVotedFor.includes(optionId),
    }),
    {
      name: 'nstudio-subscription',
    }
  )
);
