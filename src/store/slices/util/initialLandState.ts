import { GridPosition, LandState, LandTile } from "../types/land";

export const positionKey = (position: GridPosition): string => {
  return `${position.x},${position.y}`;
};

const generateInitialMap = (): Record<string, LandTile> => {
  const tiles: Record<string, LandTile> = {};

  for (let x = -3; x <= 3; x++) {
    for (let y = -3; y <= 3; y++) {
      const isControlled = x >= -1 && x <= 1 && y >= -1 && y <= 1;
      const position = { x, y };
      const key = positionKey(position);

      tiles[key] = {
        position,
        biome: "grassland",
        terrain: "flat",
        discovered: isControlled,
        controlled: isControlled,
        improvements: [],
      };
    }
  }

  tiles["0,0"].improvements = [{ type: "settlement", level: 1 }];

  return tiles;
};

export const initialState: LandState = {
  tiles: generateInitialMap(),
  viewportCenter: { x: 0, y: 0 },
  viewportZoom: 1,
  gridSize: { width: 7, height: 7 },
  biomeBaseBuildingDifficulty: {
    grassland: 1,
    steppe: 1,
    forest: 1.2,
    jungle: 1.4,
    taiga: 1.2,
    desert: 1.4,
    tundra: 1.6,
  },
  biomeGatherFoodProductionMultipliers: {
    grassland: [1.0],
    steppe: [0.8],
    forest: [1.5],
    jungle: [0.8],
    taiga: [0.5],
    desert: [0.15],
    tundra: [0.15],
  },
  biomeHunterFoodProductionMultipliers: {
    grassland: [1],
    steppe: [1],
    forest: [1],
    jungle: [1],
    taiga: [1],
    desert: [0.25],
    tundra: [0.25],
  },
  biomeFarmerFoodProductionMultipliers: {
    grassland: [1],
    steppe: [1],
    forest: [0.9],
    jungle: [0.8],
    taiga: [0.7],
    desert: [0.15],
    tundra: [0.15],
  },
};
