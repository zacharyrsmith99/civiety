import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialOccupationsState } from "./util/initialOccupationsState";

export interface OccupationsState {
  occupationAllocation: {
    hunters: number;
    gatherers: number;
    farmers: number;
    laborers: number;
    soldiers: number;
    coalMiners: number;
    ironMiners: number;
    goldMiners: number;
    woodcutters: number;
    stoneworkers: number;
    blacksmiths: number;
    tailors: number;
  };
  size: {
    hunters: number;
    gatherers: number;
    farmers: number;
    laborers: number;
    soldiers: number;
    coalMiners: number;
    ironMiners: number;
    goldMiners: number;
    woodcutters: number;
    stoneworkers: number;
    blacksmiths: number;
    tailors: number;
  };
}

const occupationsSlice = createSlice({
  name: "occupations",
  initialState: initialOccupationsState,
  reducers: {
    setOccupationAllocation(
      state,
      action: PayloadAction<OccupationsState["occupationAllocation"]>,
    ) {
      state.occupationAllocation = action.payload;
    },
    setOccupationSize(state, action: PayloadAction<OccupationsState["size"]>) {
      state.size = action.payload;
    },
  },
});

export const { setOccupationAllocation, setOccupationSize } =
  occupationsSlice.actions;
export default occupationsSlice.reducer;
