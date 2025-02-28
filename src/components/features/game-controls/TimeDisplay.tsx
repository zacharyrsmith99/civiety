import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setTickRate,
  setTickSpeed,
  togglePause,
} from "@/store/slices/gameSlice";
import { TickRate } from "@/store/slices/types/game";
import { Tooltip } from "@/components/ui/Tooltip";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const tickSpeedOptions = {
  1: 1000,
  2: 750,
  3: 500,
  4: 250,
  5: 100,
} as const;

const tickSpeedToView = {
  1000: 1,
  750: 2,
  500: 3,
  250: 4,
  100: 5,
} as const;

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const tickRateOptions = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

const TimeDisplay = () => {
  const dispatch = useAppDispatch();
  const { day, week, month, year, isPaused, tickRate, tickSpeed } =
    useAppSelector((state) => state.game);

  // eslint-disable-next-line prettier/prettier
  const displayDay = day + ((week - 1) * 7);

  const handleManualTick = () => {
    dispatch({ type: "game/manualTick" });
  };

  const handlePlayPause = () => {
    dispatch(togglePause());
  };

  const handleTickRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTickRate(e.target.value as TickRate));
  };

  const currentTickSpeedView = tickSpeedToView[
    tickSpeed as keyof typeof tickSpeedToView
  ] as 1 | 2 | 3 | 4 | 5;

  const increaseTickSpeed = () => {
    if (currentTickSpeedView < 5) {
      const newTickSpeed =
        tickSpeedOptions[
          (currentTickSpeedView + 1) as keyof typeof tickSpeedOptions
        ];
      dispatch(setTickSpeed(newTickSpeed));
    }
  };

  const decreaseTickSpeed = () => {
    if (currentTickSpeedView > 1) {
      const newTickSpeed =
        tickSpeedOptions[
          (currentTickSpeedView - 1) as keyof typeof tickSpeedOptions
        ];
      dispatch(setTickSpeed(newTickSpeed));
    }
  };

  const displayDate = `${displayDay}${getOrdinalSuffix(displayDay)} ${months[month - 1]}, Year ${year}`;

  return (
    <div className="flex flex-col border-b border-amber-700/30">
      <div className="py-2 px-3 text-center border-b border-amber-700/30">
        <div className="text-sm font-medieval text-amber-200 truncate">
          {displayDate}
        </div>
      </div>

      <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1">
            <Tooltip
              content={isPaused ? "Resume game time" : "Pause game time"}
            >
              <button
                onClick={handlePlayPause}
                className="
                  w-6 h-6 flex items-center justify-center rounded
                  transition-all duration-200
                  bg-amber-900 text-amber-100
                  hover:bg-amber-800
                  border border-amber-600/50
                "
              >
                {isPaused ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 4H6V20H10V4ZM18 4H14V20H18V4Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
            </Tooltip>

            <Tooltip content={`Advance to next ${tickRate}`}>
              <button
                onClick={handleManualTick}
                className="
                  w-6 h-6 flex items-center justify-center rounded
                  transition-all duration-200
                  bg-amber-900 text-amber-100
                  hover:bg-amber-800
                  border border-amber-600/50
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L14.5 12L6 6V18ZM16 6V18H18V6H16Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-amber-200/70 font-medieval mb-0.5">
                Game Speed
              </span>
              <Tooltip content="Changes the amount of time that passes each tick">
                <select
                  value={tickRate}
                  onChange={handleTickRateChange}
                  className="
                    h-6 px-1.5 rounded text-xs font-medieval
                    bg-slate-800 text-amber-200
                    border border-amber-700/30
                    focus:outline-none focus:border-amber-600/50
                    appearance-none
                    cursor-pointer
                    bg-[length:12px_8px]
                    bg-[right_4px_center]
                    bg-no-repeat
                    pr-6
                  "
                >
                  {tickRateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Tooltip>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[9px] text-amber-200/70 font-medieval mb-0.5">
                Speed Level
              </span>
              <div className="flex items-center gap-1">
                <Tooltip content="Decrease tick speed">
                  <button
                    onClick={decreaseTickSpeed}
                    disabled={currentTickSpeedView <= 1}
                    className="
                      w-5 h-5 flex items-center justify-center rounded text-xs font-medieval
                      transition-all duration-200
                      bg-amber-900 text-amber-100
                      hover:bg-amber-800
                      disabled:opacity-40 disabled:cursor-not-allowed
                      border border-amber-600/50
                    "
                  >
                    -
                  </button>
                </Tooltip>
                <span className="text-xs text-amber-200 w-4 text-center">
                  {currentTickSpeedView}
                </span>
                <Tooltip content="Increase tick speed">
                  <button
                    onClick={increaseTickSpeed}
                    disabled={currentTickSpeedView >= 5}
                    className="
                      w-5 h-5 flex items-center justify-center rounded text-xs font-medieval
                      transition-all duration-200
                      bg-amber-900 text-amber-100
                      hover:bg-amber-800
                      disabled:opacity-40 disabled:cursor-not-allowed
                      border border-amber-600/50
                    "
                  >
                    +
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;
