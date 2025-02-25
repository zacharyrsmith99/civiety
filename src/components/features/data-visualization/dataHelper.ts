import {
  ADULT_AGES,
  AdultCohort,
  CHILD_AGES,
  ChildCohort,
  ElderCohort,
} from "@/store/slices/types/population";

export function getPopulationAgeDataAsValues(
  populationCohorts: (ChildCohort | AdultCohort | ElderCohort)[],
) {
  const femaleAgeData: number[] = Array(100).fill(0);
  const maleAgeData: number[] = Array(100).fill(0);
  populationCohorts.forEach((cohort) => {
    switch (cohort.ageGroup) {
      case "children":
        cohort.ageDistribution.forEach((age, index) => {
          if (cohort.gender === "female") {
            femaleAgeData[index] -= age[0];
          } else {
            maleAgeData[index] += age[0];
          }
        });
        break;
      case "adults":
        cohort.ageDistribution.forEach((age, index) => {
          if (cohort.gender === "female") {
            femaleAgeData[index + CHILD_AGES] -= age[0];
          } else {
            maleAgeData[index + CHILD_AGES] += age[0];
          }
        });
        break;
      case "elders":
        cohort.ageDistribution.forEach((age, index) => {
          if (cohort.gender === "female") {
            femaleAgeData[index + ADULT_AGES + CHILD_AGES] -= age[0];
          } else {
            maleAgeData[index + ADULT_AGES + CHILD_AGES] += age[0];
          }
        });
        break;
    }
  });
  return { femaleAgeData, maleAgeData };
}

export function createAgeDataChartConfig(
  femaleAgeData: number[],
  maleAgeData: number[],
) {
  const data = {
    labels: Array.from({ length: 100 }, (_, i) => i),
    datasets: [
      {
        data: femaleAgeData,
        label: "Female",
        borderColor: "red",
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        data: maleAgeData,
        label: "Male",
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.6)",
      },
    ],
  };

  const tooltip = {
    yAlign: "bottom" as const,
    titleAlign: "center" as const,
    callbacks: {
      label: (context: { dataset: { label: string }; raw: number }) => {
        return `${context.dataset.label}: ${Math.abs(context.raw)}`;
      },
    },
  };

  const config = {
    type: "bar",
    data,
    options: {
      indexAxis: "y" as const,
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Population Age Distribution",
        },
        tooltip,
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
        },
        x: {
          stacked: true,
          ticks: {
            callback: (value: number) => {
              return Math.abs(value);
            },
          },
        },
      },
    },
  };

  return config as any;
}
