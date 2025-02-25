import { Dispatch, Middleware, UnknownAction } from "@reduxjs/toolkit";
import { processGameTick } from "./gameTick/processGameTick";
import { NewRootState } from "../store";

export function createBaseGameLoopMiddleware(): Middleware<
  {},
  NewRootState,
  Dispatch<UnknownAction>
> {
  let gameLoop: NodeJS.Timeout | null = null;

  return (store) => {
    const startGameLoop = () => {
      if (gameLoop === null) {
        gameLoop = setInterval(() => {
          const state = store.getState();
          if (!state.game.isPaused) {
            try {
              processGameTick(store);
            } catch (error) {
              console.error("Error in game loop:", error);
            }
          }
        }, 1000);
      }
    };

    startGameLoop();

    return (next) => (action) => {
      if ((action as any).type === "game/manualTick") {
        processGameTick(store);
      }
      return next(action);
    };
  };
}
