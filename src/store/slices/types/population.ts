export type AgeGroup = "children" | "adults" | "elders";
export type Gender = "male" | "female";
export type Citizenship = "citizen" | "foreigner" | "slave";

type FixedLengthArray<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : T[] & { length: N }
  : never;

export type AgeStats = [
  size: number,
  chanceOfDeath: number,
  chanceOfBirth: number,
  accumulatedAging: number,
];

export const CHILD_AGES = 16; // 0-15
export const ADULT_AGES = 48; // 16-63
export const ELDER_AGES = 36; // 64-99

export type ChildAgeDistribution = FixedLengthArray<
  AgeStats,
  typeof CHILD_AGES
>;
export type AdultAgeDistribution = FixedLengthArray<
  AgeStats,
  typeof ADULT_AGES
>;
export type ElderAgeDistribution = FixedLengthArray<
  AgeStats,
  typeof ELDER_AGES
>;

export interface PopulationCohort {
  ageGroup: AgeGroup;
  gender: Gender;
  size: number;
  citizenship: Citizenship;
}

export interface ChildCohort extends PopulationCohort {
  ageGroup: "children";
  ageDistribution: ChildAgeDistribution;
}

export interface AdultCohort extends PopulationCohort {
  ageGroup: "adults";
  ageDistribution: AdultAgeDistribution;
}

export interface ElderCohort extends PopulationCohort {
  ageGroup: "elders";
  ageDistribution: ElderAgeDistribution;
}

export interface PopulationCohortById {
  [key: string]: ChildCohort | AdultCohort | ElderCohort;
}

export interface PopulationCohortsState {
  cohorts: PopulationCohortById;
  total: number;
}
