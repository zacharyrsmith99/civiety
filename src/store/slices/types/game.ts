export type TickRate = "day" | "week" | "month" | "year";

export interface GameState {
  lastTick: number;
  day: number;
  week: number;
  month: number;
  year: number;
  isPaused: boolean;
  tickRate: TickRate;
  tickSpeed: number;
  // FOOD
  foodConsumptionBaseRates: number[];
  foodConsumptionMultipliers: number[];
  hunterFoodProductionBaseRates: number[];
  hunterFoodProductionMultipliers: number[];
  gathererFoodProductionBaseRates: number[];
  gathererFoodProductionMultipliers: number[];
  farmerFoodProductionBaseRates: number[];
  farmerFoodProductionMultipliers: number[];
  // POPULATION
  populationGrowthBaseRates: number[];
  populationGrowthMultipliers: number[];
  populationDeathMultipliers: number[];
  accumulatedPopulationLoss: number;
  accumulatedChildPopulationGrowth: number;
  femaleGenderRatio: number;
  maleGenderRatio: number;
  fertilityAgeMin: number;
  fertilityAgeMax: number;
}
