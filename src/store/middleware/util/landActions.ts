import {
  AgricultureBuildingType,
  BuildingCosts,
  BuildingQueue,
  HousingBuildingType,
  IndustryBuildingType,
  LandTile,
} from "@/store/slices/types/land";
import { RootState } from "@/store/types";

function getBuildingBaseCost(
  buildingName:
    | HousingBuildingType
    | AgricultureBuildingType
    | IndustryBuildingType,
  buildingCosts: BuildingCosts,
) {
  switch (buildingName) {
    case "makeshiftHousing":
      return buildingCosts.housing.makeshiftHousing;
    case "hut":
      return buildingCosts.housing.hut;
    case "farm":
      return buildingCosts.agriculture.farm;
    default:
      return new Error(`Building type ${buildingName} not found`);
  }
}

function processBuildingQueueItem(
  building: BuildingQueue,
  buildingCosts: BuildingCosts,
  laborProduction: number,
) {
  const { name, remainingCost, accumulatedCost } = building;

  const baseCost = getBuildingBaseCost(name, buildingCosts) as number;

  let newLaborProduction = laborProduction;
  let newRemainingCost = remainingCost;
  let newAccumulatedCost = accumulatedCost;

  if (laborProduction > remainingCost) {
    newLaborProduction = laborProduction - remainingCost;
    newRemainingCost = 0;
  } else {
    newLaborProduction = 0;
    newRemainingCost = remainingCost - laborProduction;
  }

  if (newRemainingCost > 0) {
    newAccumulatedCost = accumulatedCost + newRemainingCost;
  }

  let newBuildings: number = 0;
  if (newAccumulatedCost >= baseCost) {
    newBuildings = Math.floor(newAccumulatedCost / baseCost);
    newAccumulatedCost = newAccumulatedCost - newBuildings;
  }

  return {
    newLaborProduction,
    newRemainingCost,
    newAccumulatedCost,
    newBuildings,
  };
}

export function processBuildingQueue(
  state: RootState,
  laborProduction: number,
) {
  const { buildingQueue, buildingCosts } = state.land;

  const { tiles } = state.land;

  const newTiles: Record<string, LandTile> = {};
  const newBuildingQueue: BuildingQueue[] = [];

  let currentLaborProduction = laborProduction;

  for (const tile of Object.keys(tiles)) {
    const tileData = tiles[tile];

    newTiles[tile] = {
      ...tileData,
      buildings: {
        housing: { ...tileData.buildings.housing },
        agriculture: { ...tileData.buildings.agriculture },
        industry: { ...tileData.buildings.industry },
      },
      improvements: [...tileData.improvements.map((imp) => ({ ...imp }))],
    };
  }

  for (let i = 0; i < buildingQueue.length && currentLaborProduction > 0; i++) {
    const building = buildingQueue[i];
    const {
      newLaborProduction,
      newRemainingCost,
      newAccumulatedCost,
      newBuildings,
    } = processBuildingQueueItem(
      building,
      buildingCosts,
      currentLaborProduction,
    );

    currentLaborProduction = newLaborProduction;

    if (newRemainingCost > 0) {
      newBuildingQueue.push({
        ...building,
        remainingCost: newRemainingCost,
        accumulatedCost: newAccumulatedCost,
      });
    }
    if (newBuildings > 0) {
      const { position, type, name } = building;
      const positionKey = `${position.x},${position.y}`;

      const buildings = newTiles[positionKey].buildings[type] as Record<
        HousingBuildingType | AgricultureBuildingType | IndustryBuildingType,
        { level: number }
      >;

      buildings[name].level += newBuildings;
    }
  }

  return {
    newTiles,
    newBuildingQueue,
  };
}
