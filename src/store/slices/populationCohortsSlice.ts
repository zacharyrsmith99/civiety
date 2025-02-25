import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PopulationCohortsState } from "./types/population";
import { setupPopulationCohorts } from "./util/initialPopulationCohortsState";
import { ChildCohort, AdultCohort, ElderCohort } from "./types/population";
const initialState: PopulationCohortsState = setupPopulationCohorts();

const populationCohortsSlice = createSlice({
  name: "populationCohorts",
  initialState,
  reducers: {
    updateCohortById(
      state,
      action: PayloadAction<{
        id: string;
        cohort: ChildCohort | AdultCohort | ElderCohort;
      }>,
    ) {
      const { id, cohort } = action.payload;
      if (id in state.cohorts) {
        if (
          state.total - state.cohorts[id].size !==
          state.total - cohort.size
        ) {
          state.total = state.total - state.cohorts[id].size + cohort.size;
        }

        state.cohorts[id] = {
          ...state.cohorts[id],
          ...cohort,
        };
      } else {
        state.cohorts[id] = cohort;
      }
    },
    updateCohorts(state, action: PayloadAction<PopulationCohortsState>) {
      state.cohorts = action.payload.cohorts;
      state.total = action.payload.total;
    },
  },
});

export const { updateCohortById, updateCohorts } =
  populationCohortsSlice.actions;

export default populationCohortsSlice.reducer;
