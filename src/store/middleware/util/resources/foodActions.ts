import { AgeGroup, Citizenship, Gender } from "@/store/slices/types/population";
import { RootState } from "@/store/types";

function calculateGatherFoodProduction(
  gatherers: number,
  gathererFoodProductionBaseRates: number[],
  gathererFoodProductionMultipliers: number[],
) {
  const gathererBaseProduction = gathererFoodProductionBaseRates.reduce(
    (acc, curr) => acc + curr,
    0,
  );
  const gathererProductionWithMultipliers =
    gathererFoodProductionMultipliers.reduce(
      (acc, curr) => acc * curr,
      gathererBaseProduction,
    );
  const gathererProduction = gathererProductionWithMultipliers * gatherers;
  return gathererProduction;
}

function calculateHunterFoodProduction(
  hunters: number,
  hunterFoodProductionBaseRates: number[],
  hunterFoodProductionMultipliers: number[],
) {
  const hunterBaseProduction = hunterFoodProductionBaseRates.reduce(
    (acc, curr) => acc + curr,
    0,
  );
  const hunterProductionWithMultipliers =
    hunterFoodProductionMultipliers.reduce(
      (acc, curr) => acc * curr,
      hunterBaseProduction,
    );
  const hunterProduction = hunterProductionWithMultipliers * hunters;
  return hunterProduction;
}

export function calculateFoodProduction(state: RootState) {
  const { farmers, gatherers, hunters } = state.occupations.size;
  const tiles = Object.values(state.land.tiles);
  const gathererFoodProductionBaseRates =
    state.game.gathererFoodProductionBaseRates;
  const gathererFoodProductionMultipliers =
    state.game.gathererFoodProductionMultipliers;
  const farmerFoodProductionBaseRates =
    state.game.farmerFoodProductionBaseRates;
  const farmerFoodProductionMultipliers =
    state.game.farmerFoodProductionMultipliers;
  const hunterFoodProductionBaseRates =
    state.game.hunterFoodProductionBaseRates;
  const hunterFoodProductionMultipliers =
    state.game.hunterFoodProductionMultipliers;

  //   const farmFoodProduction = calculateTotalFarmProduction(state.land.tiles, farmers);

  const gatherFoodProduction = calculateGatherFoodProduction(
    gatherers,
    gathererFoodProductionBaseRates,
    gathererFoodProductionMultipliers,
  );
  const hunterFoodProduction = calculateHunterFoodProduction(
    hunters,
    hunterFoodProductionBaseRates,
    hunterFoodProductionMultipliers,
  );
  // const farmFoodProduction = calculateFarmFoodProduction(
  //   farmers,
  //   farmerFoodProductionBaseRates,
  //   farmerFoodProductionMultipliers,
  // );
  const foodProduction = gatherFoodProduction;
  return {
    foodProduction,
    gatherFoodProduction,
    farmFoodProduction: 0,
    hunterFoodProduction,
  };
}

interface ConsumptionRates {
  foodConsumption: number;
  foodConsumptionByCohort: FoodConsumptionByCohort[];
}

export interface FoodConsumptionByCohort {
  foodConsumption: number;
  citizenship: Citizenship;
  ageGroup: AgeGroup;
  gender: Gender;
}

export function calculateFoodConsumption(state: RootState): ConsumptionRates {
  // children consume 50% of the food of adults
  // adults consume 100% of the food of adults
  // elders consume 75% of the food of adults
  // females consume 90% of the food of males
  const { foodConsumptionBaseRates, foodConsumptionMultipliers } = state.game;
  const populationCohorts = Object.values(state.populationCohorts.cohorts);
  const baseConsumption = foodConsumptionBaseRates[0]; // Base food consumption per person per tick

  let totalConsumption = 0;
  const foodConsumptionByCohort: FoodConsumptionByCohort[] = [];
  populationCohorts.forEach((cohort) => {
    let multiplier = 1;
    if (cohort.ageGroup === "children") {
      multiplier = 0.5;
    } else if (cohort.ageGroup === "elders") {
      multiplier = 0.75;
    }

    if (cohort.gender === "female") {
      multiplier *= 0.9;
    }

    if (cohort.citizenship === "slave") {
      multiplier *= 0.75;
    }

    const cohortConsumption = cohort.size * baseConsumption * multiplier;

    foodConsumptionByCohort.push({
      foodConsumption: cohortConsumption,
      citizenship: cohort.citizenship,
      ageGroup: cohort.ageGroup,
      gender: cohort.gender,
    });

    totalConsumption += cohortConsumption;
  });

  return {
    foodConsumption: totalConsumption,
    foodConsumptionByCohort,
  };
}

export function calculateNewFoodStock(
  currentFood: number,
  production: number,
  consumption: number,
): number {
  return Math.max(0, currentFood + production - consumption);
}
