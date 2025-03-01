import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resetGame } from "./gameSlice";
import { FoodConsumptionByCohort } from "../middleware/util/resources/foodActions";
import { initialState } from "./util/initialResourceState";
import { ResourceStores } from "./types/resource";

export interface UpdateFoodPayload {
  newFood: number;
  newFoodProduction: number;
  newFarmFoodProduction: number;
  newGatherFoodProduction: number;
  newHunterFoodProduction: number;
  newFoodConsumption: number;
  newFoodConsumptionByCohort: FoodConsumptionByCohort[];
}

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    updateFood: (state, action: PayloadAction<UpdateFoodPayload>) => {
      state.stores.food = Math.max(
        0,
        state.stores.food + action.payload.newFood,
      );
      state.foodProduction = action.payload.newFoodProduction;
      state.farmFoodProduction = action.payload.newFarmFoodProduction;
      state.gatherFoodProduction = action.payload.newGatherFoodProduction;
      state.hunterFoodProduction = action.payload.newHunterFoodProduction;
      state.newFoodConsumption = action.payload.newFoodConsumption;
      state.newFoodConsumptionByCohort =
        action.payload.newFoodConsumptionByCohort;
    },
    updateHide: (
      state,
      action: PayloadAction<{
        newHide: number;
        newHideProduction: number;
        newHideConsumption: number;
      }>,
    ) => {
      state.stores.hide = action.payload.newHide;
      state.hideProduction = action.payload.newHideProduction;
      state.hideConsumption = action.payload.newHideConsumption;
    },
    updateResources: (state, action: PayloadAction<ResourceStores>) => {
      state.stores = action.payload;
    },
    updateFoodProduction: (state, action: PayloadAction<number>) => {
      state.foodProduction = action.payload;
    },
    updateFarmFoodProduction: (state, action: PayloadAction<number>) => {
      state.farmFoodProduction = action.payload;
    },
    updateGatherFoodProduction: (state, action: PayloadAction<number>) => {
      state.gatherFoodProduction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetGame, () => initialState);
  },
});

export const {
  updateFood,
  updateFarmFoodProduction,
  updateFoodProduction,
  updateGatherFoodProduction,
  updateResources,
  updateHide,
} = resourcesSlice.actions;
export default resourcesSlice.reducer;
