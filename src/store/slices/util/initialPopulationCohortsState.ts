import {
  AdultAgeDistribution,
  AgeGroup,
  AgeStats,
  ChildAgeDistribution,
  ElderAgeDistribution,
  PopulationCohortsState,
} from "../types/population";

const initialChildSize = 75;
export const initialAdultSize = 100;
const initialElderSize = 10;

const generatePreIndustrialDeathRates = () => {
  const rates: number[] = new Array(100).fill(0);
  const yearlyToDaily = (rate: number) => rate / 365;

  rates[0] = yearlyToDaily(0.4);

  for (let age = 1; age <= 4; age++) {
    rates[age] = yearlyToDaily(0.175);
  }

  for (let age = 5; age <= 17; age++) {
    rates[age] = yearlyToDaily(0.03);
  }

  for (let age = 18; age <= 39; age++) {
    rates[age] = yearlyToDaily(0.01);
  }

  for (let age = 40; age <= 63; age++) {
    const yearlyRate = 0.01 + (age - 40) * (0.03 / 23);
    rates[age] = yearlyToDaily(yearlyRate);
  }

  for (let age = 64; age <= 79; age++) {
    const yearlyRate = 0.04 + (age - 64) * (0.07 / 15);
    rates[age] = yearlyToDaily(yearlyRate);
  }

  for (let age = 80; age <= 99; age++) {
    const yearlyRate = 0.15 + (age - 80) * (0.13 / 19);
    rates[age] = yearlyToDaily(yearlyRate);
  }

  return (age: number) => rates[age] || 0;
};

function generateAgeDistributionByCohort(
  size: number,
  ageGroup: AgeGroup,
): ChildAgeDistribution | AdultAgeDistribution | ElderAgeDistribution {
  const getDeathRate = generatePreIndustrialDeathRates();
  let distribution: AgeStats[];

  switch (ageGroup) {
    case "children":
      distribution = new Array(16).fill([0, 0, 0, 0]);
      for (let i = 0; i < 16; i++) {
        distribution[i] = [0, getDeathRate(i), 0, 0];
      }
      break;
    case "adults":
      distribution = new Array(48).fill([0, 0, 0, 0]);
      for (let i = 0; i < 48; i++) {
        distribution[i] = [0, getDeathRate(i + 16), 0, 0];
      }
      break;
    case "elders":
      distribution = new Array(36).fill([0, 0, 0, 0]);
      for (let i = 0; i < 36; i++) {
        distribution[i] = [0, getDeathRate(i + 64), 0, 0];
      }
      break;
  }

  let remainingSize = size;

  switch (ageGroup) {
    case "children":
      for (let i = 0; i < 4; i++) {
        distribution[i][0] = Math.floor(remainingSize / 16);
      }
      remainingSize -= distribution
        .slice(0, 4)
        .reduce((sum, stat) => sum + stat[0], 0);

      for (let i = 4; i < 16; i++) {
        const allocatedSize = Math.floor(remainingSize / (16 - i));
        const finalAllocatedSize = Math.min(allocatedSize, remainingSize);

        distribution[i][0] = finalAllocatedSize;
        remainingSize -= finalAllocatedSize;
      }
      break;

    case "adults":
      for (let i = 0; i < 48; i++) {
        const allocatedSize = Math.max(5, Math.floor(remainingSize * 0.1));

        const finalAllocatedSize = Math.min(allocatedSize, remainingSize);

        distribution[i][0] = finalAllocatedSize;
        remainingSize -= finalAllocatedSize;
        if (remainingSize <= 0) break;
      }
      break;

    case "elders":
      for (let i = 0; i < 36; i++) {
        const allocatedSize = Math.floor(remainingSize / (36 - i));

        const finalAllocatedSize = Math.min(allocatedSize, remainingSize);

        distribution[i][0] = finalAllocatedSize;
        remainingSize -= finalAllocatedSize;
        if (remainingSize <= 0) break;
      }
      break;
  }

  return distribution as unknown as
    | ChildAgeDistribution
    | AdultAgeDistribution
    | ElderAgeDistribution;
}

export const setupPopulationCohorts = (): PopulationCohortsState => {
  return {
    cohorts: {
      "children-male-citizen": {
        ageGroup: "children",
        gender: "male",
        size: initialChildSize,
        citizenship: "citizen",
        ageDistribution: generateAgeDistributionByCohort(
          initialChildSize,
          "children",
        ) as ChildAgeDistribution,
      },
      "children-female-citizen": {
        ageGroup: "children",
        gender: "female",
        size: initialChildSize,
        citizenship: "citizen",
        ageDistribution: generateAgeDistributionByCohort(
          initialChildSize,
          "children",
        ) as ChildAgeDistribution,
      },
      "adults-male-citizen": {
        ageGroup: "adults",
        gender: "male",
        size: initialAdultSize,
        citizenship: "citizen",
        ageDistribution: generateAgeDistributionByCohort(
          initialAdultSize,
          "adults",
        ) as AdultAgeDistribution,
      },
      "adults-female-citizen": {
        ageGroup: "adults",
        gender: "female",
        size: initialAdultSize,
        citizenship: "citizen",
        ageDistribution: generateAgeDistributionByCohort(
          initialAdultSize,
          "adults",
        ) as AdultAgeDistribution,
      },
      "elders-male-citizen": {
        ageGroup: "elders",
        gender: "male",
        size: initialElderSize,
        citizenship: "citizen",
        ageDistribution: generateAgeDistributionByCohort(
          initialElderSize,
          "elders",
        ) as ElderAgeDistribution,
      },
      "elders-female-citizen": {
        ageGroup: "elders",
        gender: "female",
        size: initialElderSize,
        citizenship: "citizen",
        ageDistribution: generateAgeDistributionByCohort(
          initialElderSize,
          "elders",
        ) as ElderAgeDistribution,
      },
    },
    total: initialChildSize * 2 + initialAdultSize * 2 + initialElderSize * 2,
  };
};
