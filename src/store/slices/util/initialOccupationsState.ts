import { OccupationsState } from "../occupationsSlice";
import { initialAdultSize } from "./initialPopulationCohortsState";

export const initialOccupationsState: OccupationsState = {
  occupationAllocation: {
    hunters: 0.2,
    gatherers: 0.75,
    farmers: 0,
    laborers: 0.05,
    soldiers: 0,
    coalMiners: 0,
    ironMiners: 0,
    goldMiners: 0,
    woodcutters: 0,
    stoneworkers: 0,
    blacksmiths: 0,
    tailors: 0,
  },
  size: {
    hunters: initialAdultSize,
    gatherers: initialAdultSize,
    farmers: 0,
    laborers: 0,
    soldiers: 0,
    coalMiners: 0,
    ironMiners: 0,
    goldMiners: 0,
    woodcutters: 0,
    stoneworkers: 0,
    blacksmiths: 0,
    tailors: 0,
  },
};
