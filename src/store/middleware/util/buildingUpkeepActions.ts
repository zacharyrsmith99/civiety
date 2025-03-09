import {
  BuildingUpkeepCosts,
  HousingBuildingType,
  LandTile,
} from "@/store/slices/types/land";
import { RootState } from "@/store/types";

function getBuildingUpkeepCostsFromTile(
  tile: LandTile,
  buildingUpkeepCosts: BuildingUpkeepCosts,
) {
  const upkeepCosts = {
    labor: 0,
    food: 0,
    wood: 0,
    stone: 0,
    hide: 0,
    knowledge: 0,
  };

  const housingUpkeepCosts = {
    makeshiftHousing: {
      labor: 0,
      food: 0,
      wood: 0,
      stone: 0,
      hide: 0,
      knowledge: 0,
    },
    hut: {
      labor: 0,
      food: 0,
      wood: 0,
      stone: 0,
      hide: 0,
      knowledge: 0,
    },
  };

  if (tile.buildings.housing) {
    Object.entries(tile.buildings.housing).forEach(([key, building]) => {
      const laborCost =
        buildingUpkeepCosts.housing[key as HousingBuildingType].labor *
        building.level;
      upkeepCosts.labor += laborCost;
      housingUpkeepCosts[key as HousingBuildingType].labor += laborCost;

      const foodCost =
        buildingUpkeepCosts.housing[key as HousingBuildingType].food *
        building.level;
      upkeepCosts.food += foodCost;
      housingUpkeepCosts[key as HousingBuildingType].food += foodCost;

      const woodCost =
        buildingUpkeepCosts.housing[key as HousingBuildingType].wood *
        building.level;
      upkeepCosts.wood += woodCost;
      housingUpkeepCosts[key as HousingBuildingType].wood += woodCost;

      const stoneCost =
        buildingUpkeepCosts.housing[key as HousingBuildingType].stone *
        building.level;
      upkeepCosts.stone += stoneCost;
      housingUpkeepCosts[key as HousingBuildingType].stone += stoneCost;

      const hideCost =
        buildingUpkeepCosts.housing[key as HousingBuildingType].hide *
        building.level;
      upkeepCosts.hide += hideCost;
      housingUpkeepCosts[key as HousingBuildingType].hide += hideCost;

      const knowledgeCost =
        buildingUpkeepCosts.housing[key as HousingBuildingType].knowledge *
        building.level;
      upkeepCosts.knowledge += knowledgeCost;
      housingUpkeepCosts[key as HousingBuildingType].knowledge += knowledgeCost;
    });
  }

  return {
    upkeepCosts,
    housingUpkeepCosts,
  };
}

export function calculateBuildingUpkeepResourceUsage(
  state: RootState,
  tickRateMultiplier: number,
) {
  const resourcesUsed = {
    labor: 0,
    food: 0,
    wood: 0,
    stone: 0,
    hide: 0,
    knowledge: 0,
  };

  const tiles = Object.values(state.land.tiles);

  tiles.forEach((tile) => {
    const { upkeepCosts, housingUpkeepCosts } = getBuildingUpkeepCostsFromTile(
      tile,
      state.land.buildingUpkeepCosts,
    );
    Object.entries(upkeepCosts).forEach(([key, value]) => {
      resourcesUsed[key as keyof typeof resourcesUsed] +=
        value * tickRateMultiplier;
    });
  });

  return resourcesUsed;
}
