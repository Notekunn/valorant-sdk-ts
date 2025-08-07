// Valorant Game API Types
export interface ValorantUser {
  puuid: string;
  gameName: string;
  tagLine: string;
  region: string;
  accountLevel: number;
}

export interface ValorantMatch {
  matchInfo: {
    matchId: string;
    mapId: string;
    gamePodId: string;
    gameLoopZone: string;
    gameServerAddress: string;
    gameVersion: string;
    gameLengthMillis: number;
    gameStartMillis: number;
    provisioningFlowID: string;
    isCompleted: boolean;
    customGameName: string;
    forcePostProcessing: boolean;
    queueID: string;
    gameMode: string;
    isRanked: boolean;
    isMatchSampled: boolean;
    seasonId: string;
    completionState: string;
    platformType: string;
    partyRRPenalties: Record<string, number>;
    shouldMatchDisablePenalties: boolean;
  };
  players: Array<{
    puuid: string;
    gameName: string;
    tagLine: string;
    teamId: string;
    partyId: string;
    characterId: string;
    playerTitle: string;
    playerCardId: string;
    playerRank: string;
    accountLevel: number;
    competitiveTier: number;
    isObserver: boolean;
    playerScore: number;
    playerStats: {
      score: number;
      roundsPlayed: number;
      kills: number;
      deaths: number;
      assists: number;
      playtimeMillis: number;
      abilityCasts: {
        grenadeCasts: number;
        ability1Casts: number;
        ability2Casts: number;
        ultimateCasts: number;
      };
    };
  }>;
  teams: Array<{
    teamId: string;
    won: boolean;
    roundsPlayed: number;
    roundsWon: number;
    numPoints: number;
  }>;
  roundResults: Array<{
    roundNum: number;
    roundResult: string;
    roundCeremony: string;
    winningTeam: string;
    bombPlanter: string;
    bombDefuser: string;
    plantRoundTime: number;
    defuseRoundTime: number;
    plantPlayerLocations: Array<{
      puuid: string;
      viewRadians: number;
      location: {
        x: number;
        y: number;
      };
    }>;
    defusePlayerLocations: Array<{
      puuid: string;
      viewRadians: number;
      location: {
        x: number;
        y: number;
      };
    }>;
    playerLocations: Array<{
      puuid: string;
      viewRadians: number;
      location: {
        x: number;
        y: number;
      };
    }>;
    playerStats: Array<{
      puuid: string;
      kills: Array<{
        gameTime: number;
        roundTime: number;
        killer: string;
        victim: string;
        victimLocation: {
          x: number;
          y: number;
        };
        assistants: string[];
        playerLocations: Array<{
          puuid: string;
          viewRadians: number;
          location: {
            x: number;
            y: number;
          };
        }>;
        finishingDamage: {
          damageType: string;
          damageItem: string;
          isSecondaryFireMode: boolean;
        };
      }>;
      damage: Array<{
        receiver: string;
        damage: number;
        legshots: number;
        bodyshots: number;
        headshots: number;
      }>;
      score: number;
      economy: {
        loadoutValue: number;
        weapon: string;
        armor: string;
        remaining: number;
        spent: number;
      };
      ability: {
        grenadeEffects: any;
        ability1Effects: any;
        ability2Effects: any;
        ultimateEffects: any;
      };
      wasAfk: boolean;
      wasPenalized: boolean;
      stayedInSpawn: boolean;
    }>;
  }>;
}

export interface ValorantVersion {
  manifestId: string;
  branch: string;
  version: string;
  buildVersion: string;
  engineVersion: string;
  riotClientVersion: string;
  riotClientBuild: string;
  buildDate: string;
}

export type CurrencyMap = {
  [currencyId: string]: number;
};

export interface Reward {
  /** Item Type ID */
  ItemTypeID: string;
  /** Item ID */
  ItemID: string;
  Quantity: number;
}

export interface Offer {
  OfferID: string;
  IsDirectPurchase: boolean;
  /** Date in ISO 8601 format */
  StartDate: string;
  Cost: CurrencyMap;
  Rewards: Reward[];
}

export interface BundleItem {
  /** Item Type ID */
  ItemTypeID: string;
  /** Item ID */
  ItemID: string;
  Amount: number;
}

export interface BundleItemOffer {
  /** UUID */
  BundleItemOfferID: string;
  Offer: Offer;
  DiscountPercent: number;
  DiscountedCost: CurrencyMap;
}

export interface Bundle {
  /** UUID */
  ID: string;
  /** UUID */
  DataAssetID: string;
  /** Currency ID */
  CurrencyID: string;
  Items: {
    Item: BundleItem;
    BasePrice: number;
    /** Currency ID */
    CurrencyID: string;
    DiscountPercent: number;
    DiscountedPrice: number;
    IsPromoItem: boolean;
  }[];
  ItemOffers: BundleItemOffer[] | null;
  TotalBaseCost: CurrencyMap | null;
  TotalDiscountedCost: CurrencyMap | null;
  TotalDiscountPercent: number;
  DurationRemainingInSeconds: number;
  WholesaleOnly: boolean;
}

export interface UpgradeCurrencyOffer {
  /** UUID */
  OfferID: string;
  /** Item ID */
  StorefrontItemID: string;
  Offer: Offer;
  DiscountedPercent: number;
}

export interface AccessoryStoreOffer {
  Offer: Offer;
  /** UUID */
  ContractID: string;
}

export interface BonusStoreOffer {
  /** UUID */
  BonusOfferID: string;
  Offer: Offer;
  DiscountPercent: number;
  DiscountCosts: CurrencyMap;
  IsSeen: boolean;
}

export interface StorefrontResponse {
  FeaturedBundle: {
    Bundle: Bundle;
    Bundles: Bundle[];
    BundleRemainingDurationInSeconds: number;
  };
  SkinsPanelLayout: {
    SingleItemOffers: string[];
    SingleItemStoreOffers: Offer[];
    SingleItemOffersRemainingDurationInSeconds: number;
  };
  UpgradeCurrencyStore: {
    UpgradeCurrencyOffers: UpgradeCurrencyOffer[];
  };
  AccessoryStore: {
    AccessoryStoreOffers: AccessoryStoreOffer[];
    AccessoryStoreRemainingDurationInSeconds: number;
    /** UUID */
    StorefrontID: string;
  };
  /** Night market */
  BonusStore?: {
    BonusStoreOffers: BonusStoreOffer[];
    BonusStoreRemainingDurationInSeconds: number;
  };
}

export interface ValorantApiConfig {
  clientVersion: string;
  userAgent?: string;
  timeout?: number;
  retries?: number;
}
