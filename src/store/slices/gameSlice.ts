import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameTime, initialState } from "./util/initialGameState";
import { TickRate } from "./types/game";

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    tick: (state) => {
      state.lastTick = Date.now();
    },
    advanceTime: (state) => {
      const gameTime = new GameTime({
        day: state.day,
        week: state.week,
        month: state.month,
        year: state.year,
      });
      gameTime.advanceTime(state.tickRate);

      state.day = gameTime.day;
      state.week = gameTime.week;
      state.month = gameTime.month;
      state.year = gameTime.year;
    },
    updateAccumulatedLoss: (state, action: PayloadAction<number>) => {
      state.accumulatedPopulationLoss = action.payload;
    },
    updateAccumulatedChildPopulationGrowth: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.accumulatedChildPopulationGrowth = action.payload;
    },
    togglePause: (state) => {
      state.isPaused = !state.isPaused;
    },
    setPaused: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
    resetGame: () => initialState,
    setTickRate: (state, action: PayloadAction<TickRate>) => {
      state.tickRate = action.payload;
    },
    setTickSpeed: (state, action: PayloadAction<number>) => {
      state.tickSpeed = action.payload;
    },
  },
});

export const {
  tick,
  advanceTime,
  updateAccumulatedLoss,
  updateAccumulatedChildPopulationGrowth,
  togglePause,
  setPaused,
  resetGame,
  setTickRate,
  setTickSpeed,
} = gameSlice.actions;
export default gameSlice.reducer;
