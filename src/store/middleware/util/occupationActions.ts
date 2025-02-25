import { RootState } from "@/store/types";
import { OccupationsState } from "@/store/slices/occupationsSlice";
import { getWorkingAgePopulation } from "./stateInformationHelper";

export function canAssignHunter() {
  return true;
}

export function canAssignGatherer() {
  return true;
}

export function canAssignFarmer() {
  return true;
}

export function canAssignSoldier() {
  return true;
}

export function canAssignCoalMiner() {
  return true;
}

export function canAssignIronMiner() {
  return true;
}

export function canAssignGoldMiner() {
  return true;
}

export function canAssignWoodcutter() {
  return true;
}

export function canAssignStoneworker() {
  return true;
}

export function canAssignBlacksmith() {
  return true;
}

export function canAssignTailor() {
  return true;
}

const checkCanAssign = (
  size: OccupationsState["size"],
  key: keyof OccupationsState["size"],
) => {
  switch (key) {
    case "hunters":
      return canAssignHunter();
    case "gatherers":
      return canAssignGatherer();
    case "farmers":
      return canAssignFarmer();
    case "soldiers":
      return canAssignSoldier();
    case "coalMiners":
      return canAssignCoalMiner();
    case "ironMiners":
      return canAssignIronMiner();
    case "goldMiners":
      return canAssignGoldMiner();
    case "woodcutters":
      return canAssignWoodcutter();
    case "stoneworkers":
      return canAssignStoneworker();
    case "blacksmiths":
      return canAssignBlacksmith();
    case "tailors":
      return canAssignTailor();
    default:
      return false;
  }
};

export function reallocateOccupations(state: RootState) {
  const size: OccupationsState["size"] = {
    hunters: 0,
    gatherers: 0,
    farmers: 0,
    soldiers: 0,
    coalMiners: 0,
    ironMiners: 0,
    goldMiners: 0,
    woodcutters: 0,
    stoneworkers: 0,
    blacksmiths: 0,
    tailors: 0,
  };
  const workingPopulation = getWorkingAgePopulation(state);
  let remainingPopulation = workingPopulation;

  Object.entries(state.occupations.occupationAllocation).forEach(
    ([key, value]) => {
      const keyValue = key as keyof OccupationsState["occupationAllocation"];
      size[keyValue] = Math.floor(value * workingPopulation);
      remainingPopulation -= size[keyValue];
    },
  );

  if (remainingPopulation > 0) {
    Object.keys(size).forEach((key) => {
      if (checkCanAssign(size, key as keyof OccupationsState["size"])) {
        size[key as keyof OccupationsState["size"]] += remainingPopulation;
        remainingPopulation = 0;
      }
    });
  }
  return { size, remainingPopulation };
}
