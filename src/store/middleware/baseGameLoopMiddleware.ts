import { Dispatch, Middleware, UnknownAction } from "@reduxjs/toolkit";
import { processGameTick } from "./gameTick/processGameTick";
import { NewRootState } from "../store";

export function createBaseGameLoopMiddleware(): Middleware<
  {},
  NewRootState,
  Dispatch<UnknownAction>
> {
  let gameLoop: NodeJS.Timeout | null = null;
  let currentTickSpeed = 0;

  return (store) => {
    const restartGameLoop = () => {
      const state = store.getState();

      if (gameLoop === null || currentTickSpeed !== state.game.tickSpeed) {
        if (gameLoop !== null) {
          clearInterval(gameLoop);
          gameLoop = null;
        }

        currentTickSpeed = state.game.tickSpeed;

        gameLoop = setInterval(() => {
          const currentState = store.getState();
          if (!currentState.game.isPaused) {
            try {
              processGameTick(store);
            } catch (error) {
              console.error("Error in game loop:", error);
            }
          }
        }, currentTickSpeed);
      }
    };

    restartGameLoop();

    return (next) => (action) => {
      const result = next(action);

      if ((action as any).type === "game/setTickSpeed") {
        restartGameLoop();
      }

      if ((action as any).type === "game/manualTick") {
        processGameTick(store);
      }

      return result;
    };
  };
}
