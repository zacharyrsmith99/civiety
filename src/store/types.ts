import { store } from "./store";
import { NewRootState } from "./store";

export type RootState = NewRootState;
export type AppDispatch = typeof store.dispatch;
