import { FoodConsumptionByCohort } from "@/store/middleware/util/resources/foodActions";

interface ResourcesState {
  food: number;
  foodProduction: number;
  farmFoodProduction: number;
  gatherFoodProduction: number;
  hunterFoodProduction: number;
  newFoodConsumption: number;
  newFoodConsumptionByCohort: FoodConsumptionByCohort[];
}

export const initialState: ResourcesState = {
  food: 100,
  foodProduction: 0,
  farmFoodProduction: 0,
  gatherFoodProduction: 0,
  hunterFoodProduction: 0,
  newFoodConsumption: 0,
  newFoodConsumptionByCohort: [],
};
