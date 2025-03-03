import { GameState } from "../types/game";

export class GameTime {
  private _day: number;
  private _week: number;
  private _month: number;
  private _year: number;

  constructor({
    day,
    week,
    month,
    year,
  }: {
    day: number;
    week: number;
    month: number;
    year: number;
  }) {
    this._day = day;
    this._week = week;
    this._month = month;
    this._year = year;
  }

  get day() {
    return this._day;
  }

  set day(value: number) {
    if (value > 7) {
      this._day = 1;
      this.advanceTime("week");
    } else {
      this._day = value;
    }
  }

  get week() {
    return this._week;
  }

  set week(value: number) {
    if (value > 4) {
      this._week = 1;
      this.advanceTime("month");
    } else {
      this._week = value;
    }
  }

  get month() {
    return this._month;
  }

  set month(value: number) {
    if (value > 12) {
      this._month = 1;
      this.advanceTime("year");
    } else {
      this._month = value;
    }
  }

  get year() {
    return this._year;
  }

  set year(value: number) {
    this._year = value;
  }

  advanceTime(tickRate: "day" | "week" | "month" | "year") {
    switch (tickRate) {
      case "day":
        this.day += 1;
        break;
      case "week":
        this.week += 1;
        break;
      case "month":
        this.month += 1;
        break;
      case "year":
        this.year += 1;
        break;
    }
  }
}

export const initialState: GameState = {
  // TIME
  lastTick: Date.now(),
  day: 1,
  week: 1,
  month: 1,
  year: 0,
  isPaused: false,
  tickRate: "month",
  tickSpeed: 500,
  // FOOD
  foodConsumptionBaseRates: [0.00274],
  foodConsumptionMultipliers: [],
  hunterFoodProductionBaseRates: [0.0031],
  hunterFoodProductionMultipliers: [],
  gathererFoodProductionBaseRates: [0.0045],
  gathererFoodProductionMultipliers: [],
  farmerFoodProductionBaseRates: [0.5],
  farmerFoodProductionMultipliers: [],
  // HOUSING
  housingScore: 1,
  // POPULATION
  populationGrowthBaseRates: [0.0012],
  populationGrowthMultipliers: [],
  populationDeathMultipliers: [],
  accumulatedPopulationLoss: 0,
  accumulatedChildPopulationGrowth: 0,
  femaleGenderRatio: 0.49,
  maleGenderRatio: 0.51,
  fertilityAgeMin: 16,
  fertilityAgeMax: 48,
  foodSecurityScore: 1,
  // OCCUPATIONS
  laborerProductionBaseRates: [0.007],
  laborerProductionMultipliers: [],
  hunterHideBaseProductionRates: [0.0033],
  hunterHideProductionMultipliers: [],
};
