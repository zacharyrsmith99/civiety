"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useStore } from "react-redux";
import {
  createAgeDataChartConfig,
  getPopulationAgeDataAsValues,
} from "./dataHelper";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { RootState } from "@/store/types";

ChartJS.register(LinearScale, CategoryScale, BarElement, Tooltip, Legend);

const DataPanel = () => {
  const store = useStore();
  const [chartData, setChartData] = useState({
    femaleAgeData: [] as number[],
    maleAgeData: [] as number[],
  });

  useEffect(() => {
    const updateData = () => {
      const state = store.getState() as RootState;
      const { femaleAgeData, maleAgeData } = getPopulationAgeDataAsValues(
        Object.values(state.populationCohorts.cohorts),
      );
      setChartData({ femaleAgeData, maleAgeData });
    };

    updateData();

    const interval = setInterval(updateData, 1000);
    return () => clearInterval(interval);
  }, [store]);

  const chartConfig = useMemo(() => {
    return createAgeDataChartConfig(
      chartData.femaleAgeData,
      chartData.maleAgeData,
    );
  }, [chartData]);

  return (
    <div className="w-full h-full p-4">
      <div className="h-96">
        <Bar
          data={chartConfig.data}
          options={{
            ...chartConfig.options,
            animation: {
              duration: 0,
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(DataPanel);
