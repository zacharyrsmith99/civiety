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
  | "lumber_camp"
  | "settlement";

export interface Improvement {
  type: ImprovementType;
  level: number;
}

export interface Building {
  type: "house" | "farm" | "mine" | "lumber_camp" | "settlement";
  level: number;
}

export interface LandTile {
  position: GridPosition;
  biome: BiomeType;
  terrain: TerrainType;
  discovered: boolean;
  controlled: boolean;
  improvements: Improvement[];
}

export interface LandState {
  tiles: Record<string, LandTile>;
  viewportCenter: GridPosition;
  viewportZoom: number;
  gridSize: { width: number; height: number };
  biomeBaseBuildingDifficulty: Record<BiomeType, number>;
  biomeGatherFoodProductionMultipliers: Record<BiomeType, number[]>;
  biomeHunterFoodProductionMultipliers: Record<BiomeType, number[]>;
  biomeFarmerFoodProductionMultipliers: Record<BiomeType, number[]>;
}
