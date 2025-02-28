import {
  BiomeType,
  GridPosition,
  HousingBuilding,
  HousingBuildingType,
  LandState,
  LandTile,
  TerrainType,
} from "../types/land";

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

      const tile: LandTile = {
        position,
        biome: "grassland" as BiomeType,
        terrain: "flat" as TerrainType,
        buildings: {
          housing: {},
          agriculture: {},
          industry: {},
        },
        allowHousing: true,
        allowAgriculture: true,
        allowIndustry: true,
        usedSpaceUnits: 0,
        discovered: isControlled,
        controlled: isControlled,
        improvements: [],
      };

      tiles[key] = tile;
    }
  }

  tiles["0,0"].improvements = [{ type: "settlement", level: 1 }];
  (
    tiles["0,0"].buildings.housing as Record<
      HousingBuildingType,
      HousingBuilding
    >
  )["makeshiftHousing"] = {
    level: 1000,
  };

  tiles["0,0"].usedSpaceUnits = 1000;

  return tiles;
};

export const initialState: LandState = {
  tiles: generateInitialMap(),
  viewportCenter: { x: 0, y: 0 },
  viewportZoom: 1,
  gridSize: { width: 7, height: 7 },
  baseProductionResourcesWorkerCapacity: 1000,
  buildingInitialCosts: {
    housing: {
      makeshiftHousing: {
        labor: 1,
        hide: 2.0,
        food: 0.0,
        wood: 0.0,
        stone: 0.0,
      },
      hut: {
        labor: 2,
        hide: 4.0,
        food: 0.0,
        wood: 0.0,
        stone: 0.0,
      },
    },
    agriculture: {
      farm: {
        labor: 4,
        hide: 0.0,
        food: 0.0,
        wood: 0.0,
        stone: 0.0,
      },
    },
    industry: {
      mine: {
        labor: 50,
        hide: 0.0,
        food: 0.0,
        wood: 0.0,
        stone: 0.0,
      },
      lumberCamp: {
        labor: 10,
        hide: 0.0,
        food: 0.0,
        wood: 0.0,
        stone: 0.0,
      },
    },
  },
  buildingUpkeepCosts: {
    housing: {
      makeshiftHousing: {
        labor: 0.00028,
        hide: 0.0002,
        food: 0.0,
        wood: 0.0,
        stone: 0.0,
      },
      hut: { labor: 0.00056, hide: 0.0004, food: 0.0, wood: 0.0, stone: 0.0 },
    },
    agriculture: {
      farm: { labor: 0.0, hide: 0.0, food: 0.0, wood: 0.0, stone: 0.0 },
    },
    industry: {
      mine: { labor: 0.0, hide: 0.0, food: 0.0, wood: 0.0, stone: 0.0 },
      lumberCamp: { labor: 0.0, hide: 0.0, food: 0.0, wood: 0.0, stone: 0.0 },
    },
  },
  buildingInfo: {
    housing: {
      makeshiftHousing: { capacity: 3, spaceUnits: 1 },
      hut: { capacity: 5, spaceUnits: 1 },
    },
  },
  buildingQueue: [],
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
