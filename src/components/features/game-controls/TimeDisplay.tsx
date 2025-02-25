import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setTickRate, togglePause } from "@/store/slices/gameSlice";
import { TickRate } from "@/store/slices/types/game";

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
  const { day, week, month, year, isPaused, tickRate } = useAppSelector(
    (state) => state.game,
  );

  const handleManualTick = () => {
    dispatch({ type: "game/manualTick" });
  };

  const handlePlayPause = () => {
    dispatch(togglePause());
  };

  const handleTickRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTickRate(e.target.value as TickRate));
  };

  const displayDate = `${day}${getOrdinalSuffix(day)} ${months[month - 1]}, Year ${year}`;

  return (
    <div className="flex flex-col border-b border-amber-700/30">
      <div className="py-2 px-3 text-center border-b border-amber-700/30">
        <div className="text-sm font-medieval text-amber-200 truncate">
          {displayDate}
        </div>
      </div>

      <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className=""></span>
          <span className="text-[10px] text-amber-200/70 font-medieval">
            Current Tick Rate
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1">
            <button
              onClick={handlePlayPause}
              className={`
                w-6 h-6 flex items-center justify-center rounded text-xs font-medieval
                transition-all duration-200
                ${
                  isPaused
                    ? "bg-emerald-900 text-emerald-100 hover:bg-emerald-800 border border-emerald-600/50"
                    : "bg-amber-900 text-amber-100 hover:bg-amber-800 border border-amber-600/50"
                }
              `}
            >
              {isPaused ? "▶" : "⏸"}
            </button>
            <button
              onClick={handleManualTick}
              disabled={!isPaused}
              className="
                w-6 h-6 flex items-center justify-center rounded text-xs font-medieval
                transition-all duration-200
                bg-amber-900 text-amber-100
                hover:bg-amber-800
                disabled:opacity-40 disabled:cursor-not-allowed
                border border-amber-600/50
              "
            >
              ⏵
            </button>
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default TimeDisplay;
