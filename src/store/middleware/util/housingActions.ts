import { LandTile } from "@/store/slices/types/land";
import { RootState } from "@/store/types";

function getHousingCapacityForTile(tile: LandTile) {
  const { buildings } = tile;
  const { housing } = buildings;
  const housingCapacity = Object.values(housing).reduce((acc, building) => {
    return acc + building.capacity * building.level;
  }, 0);
  return housingCapacity;
}

export function getTotalHousingCapacity(state: RootState) {
  const { tiles } = state.land;
  const totalCapacity = Object.values(tiles).reduce((acc, tile) => {
    return acc + getHousingCapacityForTile(tile);
  }, 0);
  return totalCapacity;
}
