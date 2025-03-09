import { ResourcesState } from "../types/resource";

export const initialState: ResourcesState = {
  stores: {
    food: 100,
    hide: 5,
    stone: 0,
    wood: 0,
    knowledge: 0,
  },
  knowledgeProduction: 0,
  foodProduction: 0,
  farmFoodProduction: 0,
  gatherFoodProduction: 0,
  hunterFoodProduction: 0,
  newFoodConsumption: 0,
  hideProduction: 0,
  hideConsumption: 0,
  newFoodConsumptionByCohort: [],
};
