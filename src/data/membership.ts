export type MembershipTierId = 'explorer' | 'connoisseur' | 'ambassador';

export interface MembershipTier {
  id: MembershipTierId;
  name: string;
  minSpend: number;
  benefits: string[];
}

export interface MemberAccount {
  id: string;
  name: string;
  email: string;
  annualSpend: number;
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'explorer',
    name: 'Explorer Tier',
    minSpend: 0,
    benefits: [
      'Complimentary Singapore delivery on orders SGD 80+',
      '2-year official Nespresso Singapore machine warranty',
      'Complimentary doorstep capsule recycling collection',
    ],
  },
  {
    id: 'connoisseur',
    name: 'Connoisseur Tier',
    minSpend: 250,
    benefits: [
      'Early access to Limited-Edition collections & seasonal sleeves',
      'Complimentary tasting sessions at ION Orchard & Raffles City Boutiques',
      'Priority servicing & loan machine support',
    ],
  },
  {
    id: 'ambassador',
    name: 'Ambassador Tier',
    minSpend: 500,
    benefits: [
      'Complimentary Singapore delivery with zero minimum spend',
      'Private invitations to Master Origins & Swarovski collector previews',
      'Annual complimentary machine descaling kit & concierge care',
    ],
  },
];

export const PRESET_MEMBERS: MemberAccount[] = [
  {
    id: 'member-jocelyn',
    name: 'Jocelyn C.',
    email: 'jocelyn.c@nespresso.sg',
    annualSpend: 400,
  },
  {
    id: 'member-daniel',
    name: 'Daniel T.',
    email: 'daniel.t@nespresso.sg',
    annualSpend: 140,
  },
  {
    id: 'member-meiling',
    name: 'Mei Ling W.',
    email: 'meiling.w@nespresso.sg',
    annualSpend: 620,
  },
];

export interface TierProgress {
  currentTier: MembershipTier;
  nextTier: MembershipTier | null;
  targetThreshold: number;
  amountToNext: number;
  progressPercent: number;
}

export function getTierProgress(annualSpend: number): TierProgress {
  const safeSpend = Math.max(0, Math.round(annualSpend));

  if (safeSpend >= 500) {
    return {
      currentTier: MEMBERSHIP_TIERS[2],
      nextTier: null,
      targetThreshold: 500,
      amountToNext: 0,
      progressPercent: 100,
    };
  }

  if (safeSpend >= 250) {
    const nextTier = MEMBERSHIP_TIERS[2];
    const targetThreshold = nextTier.minSpend;
    return {
      currentTier: MEMBERSHIP_TIERS[1],
      nextTier,
      targetThreshold,
      amountToNext: Math.max(0, targetThreshold - safeSpend),
      progressPercent: Math.min(100, Math.round((safeSpend / targetThreshold) * 100)),
    };
  }

  const nextTier = MEMBERSHIP_TIERS[1];
  const targetThreshold = nextTier.minSpend;
  return {
    currentTier: MEMBERSHIP_TIERS[0],
    nextTier,
    targetThreshold,
    amountToNext: Math.max(0, targetThreshold - safeSpend),
    progressPercent: Math.min(100, Math.round((safeSpend / targetThreshold) * 100)),
  };
}
