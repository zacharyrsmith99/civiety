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
  spaceUnits: number;
  capacity: number;
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

export interface BuildingQueue {
  name: HousingBuildingType | AgricultureBuildingType | IndustryBuildingType;
  type: keyof Buildings;
  position: GridPosition;
  level: number;
  initialCost: number;
  remainingCost: number;
  accumulatedCost: number;
}

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

export interface BuildingCosts {
  housing: Record<HousingBuildingType, number>;
  agriculture: Record<AgricultureBuildingType, number>;
  industry: Record<IndustryBuildingType, number>;
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
  buildingCosts: BuildingCosts;
  buildingQueue: BuildingQueue[];
}
