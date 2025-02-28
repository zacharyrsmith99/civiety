import { FoodConsumptionByCohort } from "@/store/middleware/util/resources/foodActions";

export interface ResourceStores {
  food: number;
  hides: number;
  stone: number;
  wood: number;
}

export interface ResourcesState {
  stores: ResourceStores;
  foodProduction: number;
  farmFoodProduction: number;
  gatherFoodProduction: number;
  hunterFoodProduction: number;
  newFoodConsumption: number;
  newFoodConsumptionByCohort: FoodConsumptionByCohort[];
}
