import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resetGame } from "./gameSlice";
import { FoodConsumptionByCohort } from "@/lib/game/core/calculators/foodCalculator";
interface ResourcesState {
  food: number;
  foodProduction: number;
  farmFoodProduction: number;
  gatherFoodProduction: number;
  newFoodConsumption: number;
  newFoodConsumptionByCohort: FoodConsumptionByCohort[];
}

const initialState: ResourcesState = {
  food: 100,
  foodProduction: 0,
  farmFoodProduction: 0,
  gatherFoodProduction: 0,
  newFoodConsumption: 0,
  newFoodConsumptionByCohort: [],
};

export interface UpdateFoodPayload {
  newFood: number;
  newFoodProduction: number;
  newFarmFoodProduction: number;
  newGatherFoodProduction: number;
  newFoodConsumption: number;
  newFoodConsumptionByCohort: FoodConsumptionByCohort[];
}

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    updateFood: (state, action: PayloadAction<UpdateFoodPayload>) => {
      state.food = Math.max(0, state.food + action.payload.newFood);
      state.foodProduction = action.payload.newFoodProduction;
      state.farmFoodProduction = action.payload.newFarmFoodProduction;
      state.gatherFoodProduction = action.payload.newGatherFoodProduction;
      state.newFoodConsumption = action.payload.newFoodConsumption;
      state.newFoodConsumptionByCohort =
        action.payload.newFoodConsumptionByCohort;
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
} = resourcesSlice.actions;
export default resourcesSlice.reducer;
