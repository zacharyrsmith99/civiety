import {
  ElderCohort,
  AdultCohort,
  ChildCohort,
  AgeStats,
} from "@/store/slices/types/population";
import { RootState } from "@/store/types";

function calculateDeaths(population: number, chanceOfDeath: number): number {
  // For very small populations, use exact binomial
  if (population < 100) {
    let deaths = 0;
    for (let i = 0; i < population; i++) {
      if (Math.random() < chanceOfDeath) {
        deaths++;
      }
    }
    return deaths;
  }

  // For larger populations, use Poisson approximation
  const lambda = population * chanceOfDeath;
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
}

export function simulateNaturalPopulationChange(
  cohorts: Record<string, ChildCohort | AdultCohort | ElderCohort>,
  tickRateMultiplier: number,
): {
  newCohorts: Record<string, ChildCohort | AdultCohort | ElderCohort>;
  newTotal: number;
  totalDeaths: number;
  newDeaths: Record<string, number>;
  newAging: Record<string, number>;
} {
  const newDeaths = {
    children: 0,
    adults: 0,
    elders: 0,
  };
  const newAging = {
    children: 0,
    adults: 0,
  };
  const cohortIds = Object.keys(cohorts);
  const ageGroupOrder = ["children", "adults", "elders"];
  cohortIds.sort((a, b) => {
    const indexA = ageGroupOrder.indexOf(cohorts[a].ageGroup);
    const indexB = ageGroupOrder.indexOf(cohorts[b].ageGroup);
    return indexA - indexB;
  });
  const newCohorts: Record<string, ChildCohort | AdultCohort | ElderCohort> =
    {};

  for (const [id, cohort] of Object.entries(cohorts)) {
    newCohorts[id] = {
      ...cohort,
      ageDistribution: cohort.ageDistribution.map((ageStats) => [
        ...ageStats,
      ]) as any,
    };
  }

  let newTotal = 0;
  let totalDeaths = 0;

  for (const cohortId of cohortIds) {
    const cohort = newCohorts[cohortId];
    let cohortDeaths = 0;

    const newAgeDistribution = [...cohort.ageDistribution];

    for (let i = newAgeDistribution.length - 1; i >= 0; i--) {
      const [size, chanceOfDeath, chanceOfBirth, accumulatedAging] =
        newAgeDistribution[i];

      const newAccumulatedAging =
        accumulatedAging + (size / 365) * tickRateMultiplier;

      if (newAccumulatedAging >= 1) {
        const agingPopulation = Math.floor(newAccumulatedAging);
        const remainingAccumulatedAging = newAccumulatedAging % 1;

        // Remove aging population from current age group
        const newSize = size - agingPopulation;
        newAgeDistribution[i] = [
          newSize,
          chanceOfDeath,
          chanceOfBirth,
          remainingAccumulatedAging,
        ];

        if (i === newAgeDistribution.length - 1) {
          let nextCohortId = "";
          switch (cohort.ageGroup) {
            case "children":
              nextCohortId = `adults-${cohort.gender}-${cohort.citizenship}`;
              break;
            case "adults":
              nextCohortId = `elders-${cohort.gender}-${cohort.citizenship}`;
              break;
            // Elders over 99 just die off
          }

          if (nextCohortId && cohorts[nextCohortId]) {
            const nextCohortDist = newCohorts[nextCohortId].ageDistribution;
            const newAgeDistribution = [
              nextCohortDist[0][0] + agingPopulation,
              nextCohortDist[0][1],
              nextCohortDist[0][2],
              nextCohortDist[0][3],
            ];
            newCohorts[nextCohortId].ageDistribution[0] =
              newAgeDistribution as any;
          }

          if (cohort.ageGroup === "children" || cohort.ageGroup === "adults") {
            newAging[cohort.ageGroup] += agingPopulation;
          }
        } else {
          // Normal aging within cohort
          newAgeDistribution[i + 1][0] += agingPopulation;
        }
      } else {
        newAgeDistribution[i] = [
          size,
          chanceOfDeath,
          chanceOfBirth,
          newAccumulatedAging,
        ];
      }
    }

    const finalAgeDistribution = newAgeDistribution.map(
      ([size, chanceOfDeath, chanceOfBirth, accumulatedAging], index) => {
        const deaths = calculateDeaths(
          size,
          chanceOfDeath * tickRateMultiplier,
        );
        cohortDeaths += deaths;

        if (deaths > 0) {
          newDeaths[cohort.ageGroup] += deaths;
        }

        const newSize = size - deaths;

        return [
          Math.max(0, newSize),
          chanceOfDeath,
          chanceOfBirth,
          accumulatedAging,
        ] as AgeStats;
      },
    );
    totalDeaths += cohortDeaths;
    const cohortSize = finalAgeDistribution.reduce(
      (sum, [size]) => sum + size,
      0,
    );
    newTotal += cohortSize;

    const newCohort = {
      ...cohort,
      size: cohortSize,
      ageDistribution: finalAgeDistribution,
    };

    newCohorts[cohortId] = newCohort as ChildCohort | AdultCohort | ElderCohort;
  }

  return {
    newCohorts,
    newTotal,
    totalDeaths,
    newDeaths,
    newAging,
  };
}

function determineChildrenGender(
  children: number,
  femaleGenderRatio: number,
  maleGenderRatio: number,
) {
  const genderDistribution = [femaleGenderRatio, maleGenderRatio];
  let maleChildren = 0;
  let femaleChildren = 0;
  for (let i = 0; i < children; i++) {
    if (Math.random() < genderDistribution[0]) {
      maleChildren++;
    } else {
      femaleChildren++;
    }
  }
  return { maleChildren, femaleChildren };
}

function addChildrenToPopulation(
  newChildren: number,
  childFemaleCohort: ChildCohort,
  childMaleCohort: ChildCohort,
  femaleGenderRatio: number,
  maleGenderRatio: number,
) {
  const { maleChildren, femaleChildren } = determineChildrenGender(
    newChildren,
    femaleGenderRatio,
    maleGenderRatio,
  );
  const newChildFemaleAgeDistribution = childFemaleCohort.ageDistribution.map(
    (ageStat: AgeStats, index: number) => {
      if (index === 0) {
        return [
          ageStat[0] + femaleChildren,
          ageStat[1],
          ageStat[2],
          ageStat[3],
        ];
      }
      return ageStat;
    },
  );
  const newChildMaleAgeDistribution = childMaleCohort.ageDistribution.map(
    (ageStat: AgeStats, index: number) => {
      if (index === 0) {
        return [ageStat[0] + maleChildren, ageStat[1], ageStat[2], ageStat[3]];
      }
      return ageStat;
    },
  );
  const newChildFemaleCohort = {
    ...childFemaleCohort,
    size: childFemaleCohort.size + femaleChildren,
    ageDistribution: newChildFemaleAgeDistribution,
  };
  const newChildMaleCohort = {
    ...childMaleCohort,
    size: childMaleCohort.size + maleChildren,
    ageDistribution: newChildMaleAgeDistribution,
  };
  return { newChildFemaleCohort, newChildMaleCohort };
}

export function simulateBirths(state: RootState, tickRateMultiplier: number) {
  const {
    femaleGenderRatio,
    maleGenderRatio,
    fertilityAgeMin,
    fertilityAgeMax,
    populationGrowthBaseRates,
    populationGrowthMultipliers,
  } = state.game;
  const fertileAdultWomenSize = state.populationCohorts.cohorts[
    "adults-female-citizen"
  ].ageDistribution.reduce((sum, [size], index) => {
    return index >= fertilityAgeMin - 16 && index <= fertilityAgeMax - 16
      ? sum + size
      : sum;
  }, 0);
  const adultMales =
    state.populationCohorts.cohorts["adults-male-citizen"].size;
  const currentAccumulator = state.game.accumulatedChildPopulationGrowth;

  const breedingPairs = Math.min(fertileAdultWomenSize, adultMales);
  const populationBaseGrowthRate = populationGrowthBaseRates.reduce(
    (acc, val) => {
      return acc + val;
    },
    0,
  );
  let populationGrowthRateMultiplied = populationBaseGrowthRate;
  if (populationGrowthMultipliers.length > 0) {
    populationGrowthRateMultiplied = populationGrowthMultipliers.reduce(
      (sum, multiplier, index) => {
        return sum + populationGrowthBaseRates[index] * multiplier;
      },
      populationBaseGrowthRate,
    );
  }
  const growthThisTick =
    breedingPairs * populationGrowthRateMultiplied * tickRateMultiplier;
  const totalAccumulated = currentAccumulator + growthThisTick;

  const newChildren = Math.floor(totalAccumulated);

  const newGrowthAccumulator = totalAccumulated - newChildren;

  const { newChildFemaleCohort, newChildMaleCohort } = addChildrenToPopulation(
    newChildren,
    state.populationCohorts.cohorts["children-female-citizen"] as ChildCohort,
    state.populationCohorts.cohorts["children-male-citizen"] as ChildCohort,
    femaleGenderRatio,
    maleGenderRatio,
  );

  return {
    newChildFemaleCohort,
    newChildMaleCohort,
    newGrowthAccumulator,
    newChildren,
  };
}
