import { Dispatch } from "@reduxjs/toolkit";

import { RootState } from "@/store/types";
import { MiddlewareAPI, UnknownAction } from "@reduxjs/toolkit";
import {
  tick,
  updateAccumulatedChildPopulationGrowth,
} from "@/store/slices/gameSlice";
import { updateFood } from "@/store/slices/resourcesSlice";
import { advanceTime } from "@/store/slices/gameSlice";
import {
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
import { reallocateOccupations } from "../util/occupationActions";
import { ChildCohort } from "@/store/slices/types/population";

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
  const { foodProduction, farmFoodProduction, gatherFoodProduction } =
    calculateFoodProduction(state);
  const { foodConsumption, foodConsumptionByCohort } =
    calculateFoodConsumption(state);
  const newFood = calculateNewFoodStock(
    state.resources.food,
    foodProduction,
    foodConsumption,
  );
  store.dispatch(
    updateFood({
      newFood: newFood - state.resources.food,
      newFoodProduction: foodProduction,
      newFarmFoodProduction: farmFoodProduction,
      newGatherFoodProduction: gatherFoodProduction,
      newFoodConsumption: foodConsumption,
      newFoodConsumptionByCohort: foodConsumptionByCohort,
    }),
  );

  state = store.getState();

  const starvationMultipliers = calculateStarvationDeathRates(state);

  const { newCohorts, newTotal } = simulateNaturalPopulationChange(
    state.populationCohorts.cohorts,
    tickRateMultiplier,
    starvationMultipliers,
  );
  store.dispatch(updateCohorts({ cohorts: newCohorts, total: newTotal }));
  state = store.getState();
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
