import { HousingBuildingType, LandTile } from "@/store/slices/types/land";
import { BuildingInfo } from "@/store/slices/types/land";
import { RootState } from "@/store/types";

function getHousingCapacityForTile(tile: LandTile, buildingInfo: BuildingInfo) {
  const { buildings } = tile;
  const { housing } = buildings;
  const housingCapacity = Object.entries(housing).reduce(
    (acc, [key, building]) => {
      return (
        acc +
        buildingInfo.housing[key as HousingBuildingType].capacity *
          building.level
      );
    },
    0,
  );
  return housingCapacity;
}

export function getTotalHousingCapacity(state: RootState) {
  const { tiles } = state.land;
  const { buildingInfo } = state.land;
  const totalCapacity = Object.values(tiles).reduce((acc, tile) => {
    return acc + getHousingCapacityForTile(tile, buildingInfo);
  }, 0);
  return totalCapacity;
}
