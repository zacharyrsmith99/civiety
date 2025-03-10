import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../types";
import {
  BuildingQueueItem,
  GridPosition,
  Improvement,
  LandTile,
} from "./types/land";
import { positionKey } from "./util/initialLandState";
import { initialState } from "./util/initialLandState";

export const landSlice = createSlice({
  name: "land",
  initialState,
  reducers: {
    updateBuildings: (
      state,
      action: PayloadAction<{
        tiles: Record<string, LandTile>;
        buildingQueue: BuildingQueueItem[];
      }>,
    ) => {
      state.tiles = action.payload.tiles;
      state.buildingQueue = action.payload.buildingQueue;
    },
    updateTilePermissions: (
      state,
      action: PayloadAction<{
        position: GridPosition;
        permissions: {
          allowHousing: boolean;
          allowAgriculture: boolean;
          allowIndustry: boolean;
        };
      }>,
    ) => {
      const { position, permissions } = action.payload;
      const key = positionKey(position);

      if (state.tiles[key]) {
        state.tiles[key].allowHousing = permissions.allowHousing;
        state.tiles[key].allowAgriculture = permissions.allowAgriculture;
        state.tiles[key].allowIndustry = permissions.allowIndustry;
      }
    },
    addImprovement: (
      state,
      action: PayloadAction<{
        position: GridPosition;
        improvement: Improvement;
      }>,
    ) => {
      const { position, improvement } = action.payload;
      const key = positionKey(position);

      if (state.tiles[key] && state.tiles[key].controlled) {
        state.tiles[key].improvements.push(improvement);
      }
    },

    removeImprovement: (
      state,
      action: PayloadAction<{
        position: GridPosition;
        index: number;
      }>,
    ) => {
      const { position, index } = action.payload;
      const key = positionKey(position);

      if (state.tiles[key] && state.tiles[key].improvements.length > index) {
        state.tiles[key].improvements.splice(index, 1);
      }
    },

    discoverTile: (state, action: PayloadAction<GridPosition>) => {
      const key = positionKey(action.payload);
      if (state.tiles[key]) {
        state.tiles[key].discovered = true;
      }
    },

    claimTile: (state, action: PayloadAction<GridPosition>) => {
      const key = positionKey(action.payload);
      if (state.tiles[key]) {
        state.tiles[key].controlled = true;
        state.tiles[key].discovered = true;
      }
    },

    expandMap: (
      state,
      action: PayloadAction<{ direction: "north" | "south" | "east" | "west" }>,
    ) => {
      const { direction } = action.payload;
      const { width, height } = state.gridSize;

      if (direction === "north" || direction === "south") {
        const y =
          direction === "north"
            ? -Math.floor(height / 2) - 1
            : Math.floor(height / 2) + 1;

        for (let x = -Math.floor(width / 2); x <= Math.floor(width / 2); x++) {
          const position = { x, y };
          const key = positionKey(position);

          state.tiles[key] = {
            position,
            biome: "grassland",
            terrain: "flat",
            discovered: false,
            controlled: false,
            improvements: [],
            buildings: {
              housing: {},
              agriculture: {},
              industry: {},
            },
            allowHousing: false,
            allowAgriculture: false,
            allowIndustry: false,
            usedSpaceUnits: 0,
          };
        }

        state.gridSize.height += 1;
      } else {
        const x =
          direction === "west"
            ? -Math.floor(width / 2) - 1
            : Math.floor(width / 2) + 1;

        for (
          let y = -Math.floor(height / 2);
          y <= Math.floor(height / 2);
          y++
        ) {
          const position = { x, y };
          const key = positionKey(position);

          state.tiles[key] = {
            position,
            biome: "grassland",
            terrain: "flat",
            discovered: false,
            controlled: false,
            improvements: [],
            buildings: {
              housing: {},
              agriculture: {},
              industry: {},
            },
            allowHousing: false,
            allowAgriculture: false,
            allowIndustry: false,
            usedSpaceUnits: 0,
          };
        }

        state.gridSize.width += 1;
      }
    },

    setViewport: (
      state,
      action: PayloadAction<{
        center?: GridPosition;
        zoom?: number;
      }>,
    ) => {
      const { center, zoom } = action.payload;

      if (center) {
        state.viewportCenter = center;
      }

      if (zoom !== undefined) {
        state.viewportZoom = Math.max(0.5, Math.min(3, zoom));
      }
    },

    addBuildingToQueue: (state, action: PayloadAction<BuildingQueueItem>) => {
      state.buildingQueue.push(action.payload);
    },
  },
});

export const {
  addImprovement,
  removeImprovement,
  discoverTile,
  claimTile,
  expandMap,
  setViewport,
  updateBuildings,
  addBuildingToQueue,
  updateTilePermissions,
} = landSlice.actions;

export const selectAllTiles = (state: RootState) => state.land.tiles;
export const selectControlledTiles = (state: RootState) =>
  Object.values(state.land.tiles).filter((tile) => tile.controlled);
export const selectDiscoveredTiles = (state: RootState) =>
  Object.values(state.land.tiles).filter((tile) => tile.discovered);
export const selectTileAt = (state: RootState, position: GridPosition) =>
  state.land.tiles[positionKey(position)];
export const selectViewport = (state: RootState) => ({
  center: state.land.viewportCenter,
  zoom: state.land.viewportZoom,
});

export default landSlice.reducer;
