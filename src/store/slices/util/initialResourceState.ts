import { ResourcesState } from "../types/resource";

export const initialState: ResourcesState = {
  stores: {
    food: 100,
    hide: 5,
    stone: 0,
    wood: 0,
  },
  foodProduction: 0,
  farmFoodProduction: 0,
  gatherFoodProduction: 0,
  hunterFoodProduction: 0,
  newFoodConsumption: 0,
  newFoodConsumptionByCohort: [],
};
