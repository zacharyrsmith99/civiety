import {
  AgricultureBuildingType,
  BuildingInitialCosts,
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
  buildingInitialCosts: BuildingInitialCosts,
) {
  switch (buildingName) {
    case "makeshiftHousing":
      return buildingInitialCosts.housing.makeshiftHousing;
    case "hut":
      return buildingInitialCosts.housing.hut;
    case "farm":
      return buildingInitialCosts.agriculture.farm;
    default:
      throw new Error(`Building type ${buildingName} not found`);
  }
}

function processBuildingQueueItem(
  building: BuildingQueue,
  buildingInitialCosts: BuildingInitialCosts,
  laborProduction: number,
) {
  const { name, remainingCost, accumulatedLabor, level } = building;
  const baseCost = getBuildingBaseCost(name, buildingInitialCosts);
  const { labor, hide, food, wood, stone } = baseCost;

  let newLaborProduction = laborProduction;
  const newRemainingCost = { ...remainingCost };
  let newAccumulatedLabor = accumulatedLabor;
  let newBuildings = 0;
  let newCount = level;

  if (newLaborProduction >= newRemainingCost.labor) {
    newLaborProduction -= newRemainingCost.labor;
    newRemainingCost.labor = 0;
    newBuildings = 1;
    newCount--;

    if (newCount <= 0) {
      return {
        newLaborProduction,
        newRemainingCost,
        newAccumulatedLabor,
        newBuildings,
        newCount,
      };
    }

    if (newLaborProduction > 0) {
      const additionalBuildings = Math.min(
        Math.floor(newLaborProduction / labor),
        newCount,
      );
      newBuildings += additionalBuildings;
      newLaborProduction -= additionalBuildings * labor;
      newCount -= additionalBuildings;

      if (newCount <= 0) {
        return {
          newLaborProduction,
          newRemainingCost,
          newAccumulatedLabor,
          newBuildings,
          newCount,
        };
      }

      if (newLaborProduction > 0) {
        newAccumulatedLabor += newLaborProduction;
        newLaborProduction = 0;

        if (newAccumulatedLabor >= labor) {
          const additionalFromAccumulated = Math.min(
            Math.floor(newAccumulatedLabor / labor),
            newCount,
          );
          newBuildings += additionalFromAccumulated;
          newAccumulatedLabor -= additionalFromAccumulated * labor;
          newCount -= additionalFromAccumulated;
        }
      }
    }
  } else {
    newAccumulatedLabor += newLaborProduction;
    newRemainingCost.labor -= newLaborProduction;
    newLaborProduction = 0;

    if (newAccumulatedLabor >= labor) {
      const buildingsFromAccumulated = Math.min(
        Math.floor(newAccumulatedLabor / labor),
        newCount,
      );
      newBuildings += buildingsFromAccumulated;
      newAccumulatedLabor -= buildingsFromAccumulated * labor;
      newCount -= buildingsFromAccumulated;
    }
  }

  return {
    newLaborProduction,
    newRemainingCost,
    newAccumulatedLabor,
    newBuildings,
    newCount,
  };
}

export function processBuildingQueue(
  state: RootState,
  laborProduction: number,
) {
  const { buildingQueue, buildingInitialCosts, buildingInfo } = state.land;

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
    const newBuilding = {
      name: building.name,
      type: building.type,
      position: building.position,
      level: building.level,
      initialCost: { ...building.initialCost },
      remainingCost: { ...building.remainingCost },
      accumulatedLabor: building.accumulatedLabor,
    };
    const result = processBuildingQueueItem(
      building,
      buildingInitialCosts,
      currentLaborProduction,
    );
    if (!result) {
      newBuildingQueue.push(building);
      continue;
    }
    const {
      newLaborProduction,
      newRemainingCost,
      newAccumulatedLabor,
      newBuildings,
      newCount,
    } = result;

    currentLaborProduction = newLaborProduction;

    if (newRemainingCost.labor > 0) {
      newBuildingQueue.push({
        ...newBuilding,
        remainingCost: newRemainingCost,
        accumulatedLabor: newAccumulatedLabor,
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
        switch (type) {
          case "housing":
            buildings[name] = {
              level: newBuildings,
              capacity:
                buildingInfo.housing[name as HousingBuildingType].capacity,
              spaceUnits:
                buildingInfo.housing[name as HousingBuildingType].spaceUnits,
            };
            break;
          case "agriculture":
            throw new Error("Agriculture buildings not implemented");
          case "industry":
            throw new Error("Industry buildings not implemented");
          default:
            throw new Error(`Building type ${type} not implemented`);
        }
      }
    }
  }

  return {
    newTiles,
    newBuildingQueue,
  };
}
