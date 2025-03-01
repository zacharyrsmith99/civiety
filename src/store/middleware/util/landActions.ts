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
  const additionalBuildingsLabor = Math.floor(
    laborProduction / baseCosts.laborBaseCost,
  );
  const additionalBuildingsFood = Math.floor(
    resourceStores.food / baseCosts.foodBaseCost,
  );
  const additionalBuildingsHide = Math.floor(
    resourceStores.hide / baseCosts.hideBaseCost,
  );
  const additionalBuildingsWood = Math.floor(
    resourceStores.wood / baseCosts.woodBaseCost,
  );
  const additionalBuildingsStone = Math.floor(
    resourceStores.stone / baseCosts.stoneBaseCost,
  );
  const additionalBuildings = Math.min(
    additionalBuildingsFood ? additionalBuildingsFood : Infinity,
    additionalBuildingsHide ? additionalBuildingsHide : Infinity,
    additionalBuildingsWood ? additionalBuildingsWood : Infinity,
    additionalBuildingsStone ? additionalBuildingsStone : Infinity,
    additionalBuildingsLabor ? additionalBuildingsLabor : Infinity,
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
    newAccumulatedLabor += newLaborProduction;
    newRemainingCost.labor -= newLaborProduction;
    newLaborProduction = 0;

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
    if (!result) {
      newBuildingQueue.push(building);
      continue;
    }
    const {
      newLaborProduction,
      newRemainingCost,
      newAccumulatedLabor,
      newBuildings,
      newLevel,
    } = result;

    currentLaborProduction = newLaborProduction;

    if (newRemainingCost.labor > 0) {
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
  };
}
