import { RootState } from "../../types";
import { AgeGroup, Citizenship, Gender } from "@/store/slices/types/population";

export function getCohortPopulation(
  state: RootState,
  filters?: {
    ageGroup?: AgeGroup;
    gender?: Gender;
    citizenship?: Citizenship;
  },
): number {
  return Object.values(state.populationCohorts.cohorts)
    .filter((cohort) => {
      if (filters?.ageGroup && cohort.ageGroup !== filters.ageGroup)
        return false;
      if (filters?.gender && cohort.gender !== filters.gender) return false;
      if (filters?.citizenship && cohort.citizenship !== filters.citizenship)
        return false;
      return true;
    })
    .reduce((sum, cohort) => sum + cohort.size, 0);
}

export function getWorkingAgePopulation(
  state: RootState,
  filters?: {
    gender?: Gender;
    citizenship?: Citizenship;
  },
): number {
  return getCohortPopulation(state, { ...filters, ageGroup: "adults" });
}

export function findCohort(
  state: RootState,
  ageGroup: AgeGroup,
  gender: Gender,
  citizenship: Citizenship,
) {
  return Object.values(state.populationCohorts.cohorts).find(
    (cohort) =>
      cohort.ageGroup === ageGroup &&
      cohort.gender === gender &&
      cohort.citizenship === citizenship,
  );
}
