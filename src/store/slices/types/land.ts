import { ResourceStores } from "./resource";

export type TerrainType = "flat" | "hill" | "coastal" | "mountain";
export type BiomeType =
  | "grassland"
  | "steppe"
  | "forest"
  | "jungle"
  | "taiga"
  | "desert"
  | "tundra";
export type LandType = "undeveloped" | "arable";

export interface GridPosition {
  x: number;
  y: number;
}

export type ImprovementType =
  | "none"
  | "farm"
  | "mine"
  | "lumberCamp"
  | "settlement";

export interface Improvement {
  type: ImprovementType;
  level: number;
}

export type BuildingType =
  | "housing"
  | "agriculture"
  | "industry"
  | "settlement";

export type AgricultureBuildingType = "farm";
export type IndustryBuildingType = "mine" | "lumberCamp";
export type SettlementBuildingType = "settlement";
export type HousingBuildingType = "makeshiftHousing" | "hut";

export interface HousingBuilding {
  level: number;
}

export interface AgricultureBuilding {
  level: number;
  workerCapacity: number;
  spaceUnits: number;
}

export interface IndustryBuilding {
  level: number;
  workerCapacity: number;
  spaceUnits: number;
}

export interface Buildings {
  housing: Record<HousingBuildingType, HousingBuilding> | {};
  agriculture: Record<AgricultureBuildingType, AgricultureBuilding> | {};
  industry: Record<IndustryBuildingType, IndustryBuilding> | {};
}

export type HousingBuildingInitialCosts = {
  labor: number;
} & {
  [key in keyof ResourceStores]: number;
};

export type HousingBuildingRemainingCosts = {
  labor: number;
} & {
  [key in keyof ResourceStores]: number;
};

export type AgricultureBuildingInitialCosts = {
  labor: number;
} & {
  [key in keyof ResourceStores]: number;
};

export type AgricultureBuildingRemainingCosts = {
  labor: number;
} & {
  [key in keyof ResourceStores]: number;
};

export type IndustryBuildingInitialCosts = {
  labor: number;
} & {
  [key in keyof ResourceStores]: number;
};

export type IndustryBuildingRemainingCosts = {
  labor: number;
} & {
  [key in keyof ResourceStores]: number;
};

export interface HousingBuildingQueueItem {
  name: HousingBuildingType;
  type: keyof Buildings;
  position: GridPosition;
  level: number;
  initialCost: HousingBuildingInitialCosts;
  remainingCost: AgricultureBuildingRemainingCosts;
  accumulatedLabor: number;
}

export interface AgricultureBuildingQueueItem {
  name: AgricultureBuildingType;
  type: keyof Buildings;
  position: GridPosition;
  level: number;
  initialCost: AgricultureBuildingInitialCosts;
  remainingCost: AgricultureBuildingRemainingCosts;
  accumulatedLabor: number;
}

export interface IndustryBuildingQueueItem {
  name: IndustryBuildingType;
  type: keyof Buildings;
  position: GridPosition;
  level: number;
  initialCost: IndustryBuildingInitialCosts;
  remainingCost: IndustryBuildingRemainingCosts;
  accumulatedLabor: number;
}

export type BuildingQueueItem =
  | HousingBuildingQueueItem
  | AgricultureBuildingQueueItem
  | IndustryBuildingQueueItem;

export interface LandTile {
  position: GridPosition;
  biome: BiomeType;
  terrain: TerrainType;
  buildings: Buildings;
  allowHousing: boolean;
  allowAgriculture: boolean;
  allowIndustry: boolean;
  usedSpaceUnits: number;
  discovered: boolean;
  controlled: boolean;
  improvements: Improvement[];
}

export interface BuildingInitialCosts {
  housing: Record<HousingBuildingType, HousingBuildingInitialCosts>;
  agriculture: Record<AgricultureBuildingType, AgricultureBuildingInitialCosts>;
  industry: Record<IndustryBuildingType, IndustryBuildingInitialCosts>;
}

export type ResourceUpkeepCosts = {
  labor: number;
} & {
  [key in keyof ResourceStores]: number;
};

export interface BuildingUpkeepCosts {
  housing: Record<HousingBuildingType, ResourceUpkeepCosts>;
  agriculture: Record<AgricultureBuildingType, ResourceUpkeepCosts>;
  industry: Record<IndustryBuildingType, ResourceUpkeepCosts>;
}

export interface BuildingInfo {
  housing: Record<
    HousingBuildingType,
    {
      capacity: number;
      spaceUnits: number;
    }
  >;
}

export interface LandState {
  tiles: Record<string, LandTile>;
  viewportCenter: GridPosition;
  viewportZoom: number;
  gridSize: { width: number; height: number };
  baseProductionResourcesWorkerCapacity: number;
  biomeBaseBuildingDifficulty: Record<BiomeType, number>;
  biomeGatherFoodProductionMultipliers: Record<BiomeType, number[]>;
  biomeHunterFoodProductionMultipliers: Record<BiomeType, number[]>;
  biomeFarmerFoodProductionMultipliers: Record<BiomeType, number[]>;
  buildingInitialCosts: BuildingInitialCosts;
  buildingUpkeepCosts: BuildingUpkeepCosts;
  buildingQueue: BuildingQueueItem[];
  buildingInfo: BuildingInfo;
}
