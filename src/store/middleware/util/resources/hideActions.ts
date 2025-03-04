import { RootState } from "@/store/types";

export function calculateHunterHideProduction(
  hunters: number,
  hideProductionBaseRates: number[],
  hideProductionMultipliers: number[],
  tickRateMultiplier: number,
  hideProductionCapacity: number,
) {
  const hideProduction = hideProductionBaseRates.reduce(
    (acc, curr) => acc + curr,
    0,
  );
  const hideProductionMultiplier = hideProductionMultipliers.reduce(
    (acc, curr) => acc * curr,
    1,
  );
  return (
    hideProduction * hideProductionMultiplier * hunters * tickRateMultiplier
  );
}

export function calculateHideProduction(
  state: RootState,
  tickRateMultiplier: number,
) {
  const hunters = state.occupations.size.hunters;
  const hideProductionBaseRates = state.game.hunterHideBaseProductionRates;
  const hideProductionMultipliers = state.game.hunterHideProductionMultipliers;
  const hideProductionCapacity = 8000; // TODO: get from tiles
  return calculateHunterHideProduction(
    hunters,
    hideProductionBaseRates,
    hideProductionMultipliers,
    tickRateMultiplier,
    hideProductionCapacity,
  );
}

export function calculateHideConsumption(hideBuildingConsumption: number) {
  return hideBuildingConsumption;
}

export function calculateNewHideStock(
  currentHide: number,
  production: number,
  consumption: number,
) {
  return Math.max(0, currentHide + production - consumption);
}
