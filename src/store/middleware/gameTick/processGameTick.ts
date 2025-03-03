import { Dispatch } from "@reduxjs/toolkit";

import { RootState } from "@/store/types";
import { MiddlewareAPI, UnknownAction } from "@reduxjs/toolkit";
import {
  setFoodSecurityScore,
  setHousingScore,
  tick,
  updateAccumulatedChildPopulationGrowth,
} from "@/store/slices/gameSlice";
import {
  updateFood,
  updateHide,
  updateResources,
} from "@/store/slices/resourcesSlice";
import { advanceTime } from "@/store/slices/gameSlice";
import {
  calculateLackOfHousingDeathRates,
  calculateStarvationDeathRates,
  simulateBirths,
  simulateNaturalPopulationChange,
} from "../util/populationCohortActions";
import {
  calculateFoodConsumption,
  calculateFoodProduction,
  calculateNewFoodStock,
} from "../util/resources/foodActions";
import {
  updateCohortById,
  updateCohorts,
} from "@/store/slices/populationCohortsSlice";
import { setOccupationSize } from "@/store/slices/occupationsSlice";
import {
  calculateLaborerProduction,
  reallocateOccupations,
} from "../util/occupationActions";
import { ChildCohort } from "@/store/slices/types/population";
import { processBuildingQueue } from "../util/landActions";
import { updateBuildings } from "@/store/slices/landSlice";
import {
  calculateHideConsumption,
  calculateHideProduction,
  calculateNewHideStock,
} from "../util/resources/hideActions";
import { calculateBuildingUpkeepResourceUsage } from "../util/buildingUpkeepActions";

export function processGameTick(
  store: MiddlewareAPI<Dispatch<UnknownAction>, RootState>,
) {
  const now = Date.now();

  store.dispatch(tick());
  let state = store.getState();

  const tickRateMultipliers = {
    day: 1,
    week: 7,
    month: 30,
    year: 365,
  };

  const tickRateMultiplier = tickRateMultipliers[state.game.tickRate];
  // Calculate and update food
  const {
    foodProduction,
    farmFoodProduction,
    gatherFoodProduction,
    hunterFoodProduction,
  } = calculateFoodProduction(state, tickRateMultiplier);
  const { foodConsumption, foodConsumptionByCohort } = calculateFoodConsumption(
    state,
    tickRateMultiplier,
  );
  const newFood = calculateNewFoodStock(
    state.resources.stores.food,
    foodProduction,
    foodConsumption,
  );
  store.dispatch(
    updateFood({
      newFood: newFood - state.resources.stores.food,
      newFoodProduction: foodProduction,
      newFarmFoodProduction: farmFoodProduction,
      newGatherFoodProduction: gatherFoodProduction,
      newHunterFoodProduction: hunterFoodProduction,
      newFoodConsumption: foodConsumption,
      newFoodConsumptionByCohort: foodConsumptionByCohort,
    }),
  );

  const hideProduction = calculateHideProduction(state, tickRateMultiplier);
  const hideConsumption = calculateHideConsumption(state, tickRateMultiplier);
  const newHide = calculateNewHideStock(
    state.resources.stores.hide,
    hideProduction,
    hideConsumption,
  );
  store.dispatch(
    updateHide({
      newHide: newHide,
      newHideProduction: hideProduction,
      newHideConsumption: hideConsumption,
    }),
  );
  state = store.getState();

  const { starvationDeathRateMultipliers, foodSecurityScore } =
    calculateStarvationDeathRates(state);
  store.dispatch(setFoodSecurityScore(foodSecurityScore));
  const { housingDeathRateMultipliers, housingScore } =
    calculateLackOfHousingDeathRates(state);
  store.dispatch(setHousingScore(housingScore));

  const { newCohorts, newTotal } = simulateNaturalPopulationChange(
    state.populationCohorts.cohorts,
    tickRateMultiplier,
    starvationDeathRateMultipliers,
    housingDeathRateMultipliers,
  );
  store.dispatch(updateCohorts({ cohorts: newCohorts, total: newTotal }));
  state = store.getState();

  const buildingUpkeep = calculateBuildingUpkeepResourceUsage(state);
  const newResources = {
    food: state.resources.stores.food - buildingUpkeep.food,
    wood: state.resources.stores.wood - buildingUpkeep.wood,
    stone: state.resources.stores.stone - buildingUpkeep.stone,
    hide: state.resources.stores.hide - buildingUpkeep.hide,
  };
  store.dispatch(updateResources(newResources));
  if (state.land.buildingQueue.length > 0) {
    let laborerProduction = calculateLaborerProduction(
      state,
      tickRateMultiplier,
    );
    if (buildingUpkeep.labor > 0) {
      laborerProduction -= buildingUpkeep.labor;
    }
    const { newTiles, newBuildingQueue, resources } = processBuildingQueue(
      state,
      laborerProduction,
    );
    store.dispatch(
      updateBuildings({ tiles: newTiles, buildingQueue: newBuildingQueue }),
    );
    store.dispatch(updateResources(resources));
  }
  const { newChildFemaleCohort, newChildMaleCohort, newGrowthAccumulator } =
    simulateBirths(state, tickRateMultiplier);

  store.dispatch(
    updateCohortById({
      id: "children-female-citizen",
      cohort: newChildFemaleCohort as ChildCohort,
    }),
  );
  store.dispatch(
    updateCohortById({
      id: "children-male-citizen",
      cohort: newChildMaleCohort as ChildCohort,
    }),
  );
  store.dispatch(updateAccumulatedChildPopulationGrowth(newGrowthAccumulator));
  state = store.getState();
  const { size } = reallocateOccupations(state);
  store.dispatch(setOccupationSize(size));
  store.dispatch(advanceTime());

  // console.log("time between ticks", Date.now() - now);
}
