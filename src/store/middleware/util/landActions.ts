import {
  AgricultureBuildingType,
  BuildingInitialCosts,
  BuildingQueue,
  HousingBuildingType,
  IndustryBuildingType,
  LandTile,
} from "@/store/slices/types/land";
import { ResourceStores } from "@/store/slices/types/resource";
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

interface BaseCosts {
  laborBaseCost: number;
  hideBaseCost: number;
  foodBaseCost: number;
  woodBaseCost: number;
  stoneBaseCost: number;
}

function calculateBuildings(
  laborProduction: number,
  baseCosts: BaseCosts,
  resourceStores: ResourceStores,
  level: number,
) {
  const calculateAdditionalBuildings = (
    resourceAmount: number,
    baseCost: number,
  ) => {
    const result = Math.floor(resourceAmount / baseCost);
    if (isNaN(result)) {
      return Infinity;
    }
    return result;
  };

  const additionalBuildingsLabor = calculateAdditionalBuildings(
    laborProduction,
    baseCosts.laborBaseCost,
  );
  const additionalBuildingsFood = calculateAdditionalBuildings(
    resourceStores.food,
    baseCosts.foodBaseCost,
  );
  const additionalBuildingsHide = calculateAdditionalBuildings(
    resourceStores.hide,
    baseCosts.hideBaseCost,
  );
  const additionalBuildingsWood = calculateAdditionalBuildings(
    resourceStores.wood,
    baseCosts.woodBaseCost,
  );
  const additionalBuildingsStone = calculateAdditionalBuildings(
    resourceStores.stone,
    baseCosts.stoneBaseCost,
  );

  console.log({
    additionalBuildingsFood,
    additionalBuildingsHide,
    additionalBuildingsWood,
    additionalBuildingsStone,
    additionalBuildingsLabor,
  });

  const additionalBuildings = Math.min(
    additionalBuildingsFood,
    additionalBuildingsHide,
    additionalBuildingsWood,
    additionalBuildingsStone,
    additionalBuildingsLabor,
  );

  return Math.min(additionalBuildings, level);
}

function subtractResources(
  resources: ResourceStores,
  remainingCost: {
    labor: number;
    hide: number;
    food: number;
    wood: number;
    stone: number;
  },
  laborProduction: number,
  baseCost: BaseCosts,
  buildingLevel: number,
) {
  resources.food -= baseCost.foodBaseCost * buildingLevel;
  resources.hide -= baseCost.hideBaseCost * buildingLevel;
  resources.wood -= baseCost.woodBaseCost * buildingLevel;
  resources.stone -= baseCost.stoneBaseCost * buildingLevel;

  remainingCost.hide -= baseCost.hideBaseCost * buildingLevel;
  remainingCost.wood -= baseCost.woodBaseCost * buildingLevel;
  remainingCost.stone -= baseCost.stoneBaseCost * buildingLevel;
  remainingCost.labor -= baseCost.laborBaseCost * buildingLevel;

  laborProduction -= baseCost.laborBaseCost * buildingLevel;

  return laborProduction;
}

function processBuildingQueueItem(
  building: BuildingQueue,
  buildingInitialCosts: BuildingInitialCosts,
  resourceStores: ResourceStores,
  laborProduction: number,
) {
  const { name, remainingCost, accumulatedLabor, level } = building;
  const baseCost = getBuildingBaseCost(name, buildingInitialCosts);
  const {
    labor: laborBaseCost,
    hide: hideBaseCost,
    food: foodBaseCost,
    wood: woodBaseCost,
    stone: stoneBaseCost,
  } = baseCost;

  let newLaborProduction = laborProduction;
  const newRemainingCost = { ...remainingCost };
  let newAccumulatedLabor = accumulatedLabor;
  let newBuildings = 0;
  let newLevel = level;

  const buildingsThatCanBeBuilt = calculateBuildings(
    newLaborProduction,
    {
      laborBaseCost,
      hideBaseCost,
      foodBaseCost,
      woodBaseCost,
      stoneBaseCost,
    },
    resourceStores,
    level,
  );

  console.log({
    buildingsThatCanBeBuilt,
    newLaborProduction,
    newRemainingCost,
    newAccumulatedLabor,
    newBuildings,
    newLevel,
  });
  if (buildingsThatCanBeBuilt > 0) {
    newBuildings += buildingsThatCanBeBuilt;
    newLaborProduction = subtractResources(
      resourceStores,
      newRemainingCost,
      newLaborProduction,
      {
        laborBaseCost,
        hideBaseCost,
        foodBaseCost,
        woodBaseCost,
        stoneBaseCost,
      },
      buildingsThatCanBeBuilt,
    );
    newLevel -= buildingsThatCanBeBuilt;
  } else {
    const maxAccumulatedLabor = Math.floor(newLaborProduction / laborBaseCost);
    if (newAccumulatedLabor + newLaborProduction > maxAccumulatedLabor) {
      newAccumulatedLabor = maxAccumulatedLabor;
    } else {
      newAccumulatedLabor += newLaborProduction;
    }

    if (newRemainingCost.labor - newLaborProduction <= 0) {
      newLaborProduction -= newRemainingCost.labor;
      newRemainingCost.labor = 0;
    } else {
      newRemainingCost.labor -= newLaborProduction;
      newLaborProduction = 0;
    }

    const additionalBuildingsFromAccumulated = calculateBuildings(
      newAccumulatedLabor,
      {
        laborBaseCost,
        hideBaseCost,
        foodBaseCost,
        woodBaseCost,
        stoneBaseCost,
      },
      resourceStores,
      newLevel,
    );

    if (additionalBuildingsFromAccumulated > 0) {
      newLaborProduction = subtractResources(
        resourceStores,
        newRemainingCost,
        newAccumulatedLabor,
        {
          laborBaseCost,
          hideBaseCost,
          foodBaseCost,
          woodBaseCost,
          stoneBaseCost,
        },
        additionalBuildingsFromAccumulated,
      );
      newBuildings += additionalBuildingsFromAccumulated;
      newAccumulatedLabor -= additionalBuildingsFromAccumulated * laborBaseCost;
      newLevel -= additionalBuildingsFromAccumulated;
    }
  }

  return {
    newLaborProduction,
    newRemainingCost,
    newAccumulatedLabor,
    newBuildings,
    newLevel,
  };
}

function hasRemainingCost(remainingCost: {
  labor: number;
  hide: number;
  food: number;
  wood: number;
  stone: number;
}) {
  return (
    remainingCost.labor > 0 ||
    remainingCost.hide > 0 ||
    remainingCost.food > 0 ||
    remainingCost.wood > 0 ||
    remainingCost.stone > 0
  );
}

export function processBuildingQueue(
  state: RootState,
  laborProduction: number,
) {
  const stores = state.resources.stores;
  const newStores = { ...stores };
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
      newStores,
      currentLaborProduction,
    );

    const {
      newLaborProduction,
      newRemainingCost,
      newAccumulatedLabor,
      newBuildings,
      newLevel,
    } = result;

    currentLaborProduction = newLaborProduction;

    if (hasRemainingCost(newRemainingCost)) {
      newBuildingQueue.push({
        ...newBuilding,
        remainingCost: newRemainingCost,
        accumulatedLabor: newAccumulatedLabor,
        level: newLevel,
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
    resources: newStores,
  };
}
