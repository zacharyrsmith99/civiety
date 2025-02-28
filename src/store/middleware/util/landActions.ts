import {
  AgricultureBuildingType,
  BuildingCosts,
  BuildingQueue,
  HousingBuildingType,
  IndustryBuildingType,
  LandTile,
} from "@/store/slices/types/land";
import { RootState } from "@/store/types";

// TODO: add to redux state
const housingBuildingCapacityAndSpaceUnits = {
  makeshiftHousing: { capacity: 3, spaceUnits: 1 },
  hut: { capacity: 5, spaceUnits: 1 },
};

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
  const { name, remainingCost, accumulatedCost, level } = building;
  const baseCost = getBuildingBaseCost(name, buildingCosts) as number;

  let newLaborProduction = laborProduction;
  let newRemainingCost = remainingCost;
  let newAccumulatedCost = accumulatedCost;
  let newBuildings = 0;
  let newCount = level;

  if (newLaborProduction >= newRemainingCost) {
    newLaborProduction -= newRemainingCost;
    newRemainingCost = 0;
    newBuildings = 1;
    newCount--;

    if (newCount <= 0) {
      return {
        newLaborProduction,
        newRemainingCost,
        newAccumulatedCost,
        newBuildings,
        newCount,
      };
    }

    if (newLaborProduction > 0) {
      const additionalBuildings = Math.min(
        Math.floor(newLaborProduction / baseCost),
        newCount,
      );
      newBuildings += additionalBuildings;
      newLaborProduction -= additionalBuildings * baseCost;
      newCount -= additionalBuildings;

      if (newCount <= 0) {
        return {
          newLaborProduction,
          newRemainingCost,
          newAccumulatedCost,
          newBuildings,
          newCount,
        };
      }

      if (newLaborProduction > 0) {
        newAccumulatedCost += newLaborProduction;
        newLaborProduction = 0;

        if (newAccumulatedCost >= baseCost) {
          const additionalFromAccumulated = Math.min(
            Math.floor(newAccumulatedCost / baseCost),
            newCount,
          );
          newBuildings += additionalFromAccumulated;
          newAccumulatedCost -= additionalFromAccumulated * baseCost;
          newCount -= additionalFromAccumulated;
        }
      }
    }
  } else {
    newAccumulatedCost += newLaborProduction;
    newRemainingCost -= newLaborProduction;
    newLaborProduction = 0;

    if (newAccumulatedCost >= baseCost) {
      const buildingsFromAccumulated = Math.min(
        Math.floor(newAccumulatedCost / baseCost),
        newCount,
      );
      newBuildings += buildingsFromAccumulated;
      newAccumulatedCost -= buildingsFromAccumulated * baseCost;
      newCount -= buildingsFromAccumulated;
    }
  }

  return {
    newLaborProduction,
    newRemainingCost,
    newAccumulatedCost,
    newBuildings,
    newCount,
  };
}

// TODO: fix for other building types

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
        housing: Object.fromEntries(
          Object.entries(tileData.buildings.housing).map(([key, value]) => [
            key,
            { ...value },
          ]),
        ),
        agriculture: Object.fromEntries(
          Object.entries(tileData.buildings.agriculture).map(([key, value]) => [
            key,
            { ...value },
          ]),
        ),
        industry: Object.fromEntries(
          Object.entries(tileData.buildings.industry).map(([key, value]) => [
            key,
            { ...value },
          ]),
        ),
      },
      improvements: [...tileData.improvements.map((imp) => ({ ...imp }))],
    };
  }

  for (let i = 0; i < buildingQueue.length; i++) {
    if (currentLaborProduction <= 0) {
      newBuildingQueue.push(buildingQueue[i]);
      continue;
    }
    const building = buildingQueue[i];
    const newBuilding = { ...building };
    const result = processBuildingQueueItem(
      building,
      buildingCosts,
      currentLaborProduction,
    );
    if (!result) {
      newBuildingQueue.push(building);
      continue;
    }
    const {
      newLaborProduction,
      newRemainingCost,
      newAccumulatedCost,
      newBuildings,
      newCount,
    } = result;

    currentLaborProduction = newLaborProduction;

    if (newRemainingCost > 0) {
      newBuildingQueue.push({
        ...newBuilding,
        remainingCost: newRemainingCost,
        accumulatedCost: newAccumulatedCost,
        level: newCount,
      });
    }
    if (newBuildings > 0) {
      const { position, type, name } = newBuilding;
      const positionKey = `${position.x},${position.y}`;

      const buildings = newTiles[positionKey].buildings[type] as Record<
        HousingBuildingType | AgricultureBuildingType | IndustryBuildingType,
        { level: number; capacity: number; spaceUnits: number }
      >;

      if (buildings[name]) {
        buildings[name].level += newBuildings;
      } else {
        buildings[name] = {
          level: newBuildings,
          capacity:
            housingBuildingCapacityAndSpaceUnits[name as HousingBuildingType]
              .capacity,
          spaceUnits:
            housingBuildingCapacityAndSpaceUnits[name as HousingBuildingType]
              .spaceUnits,
        };
      }
    }
  }

  return {
    newTiles,
    newBuildingQueue,
  };
}
