import { combineReducers, configureStore } from "@reduxjs/toolkit";
import gameReducer from "./slices/gameSlice";
import resourcesReducer from "./slices/resourcesSlice";
import landReducer from "./slices/landSlice";
import populationCohortsReducer from "./slices/populationCohortsSlice";
import occupationsReducer from "./slices/occupationsSlice";
import { createBaseGameLoopMiddleware } from "./middleware/baseGameLoopMiddleware";

const baseGameLoopMiddleware = createBaseGameLoopMiddleware();

const rootReducer = combineReducers({
  game: gameReducer,
  resources: resourcesReducer,
  land: landReducer,
  populationCohorts: populationCohortsReducer,
  occupations: occupationsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["game/tick"],
      },
    }).concat(baseGameLoopMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type NewRootState = ReturnType<typeof rootReducer>;

const initialState = store.getState();
console.log("Initial State:", initialState);
