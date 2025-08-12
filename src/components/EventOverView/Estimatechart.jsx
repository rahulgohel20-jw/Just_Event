import React from "react";
import ReactApexChart from "react-apexcharts";
import { EditOutlined } from "@ant-design/icons";

const Estimatechart = () => {
  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    grid: { show: false, padding: { left: 0, right: 0 } },
    xaxis: {
      categories: Array(14).fill(""),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    tooltip: { enabled: false },
    colors: ["#BB8A5C"],
  };

  const chartSeries = [
    {
      name: "Value",
      data: [100, 70, 80, 80, 100, 90, 50, 60, 100, 80, 70, 70, 80, 110],
    },
  ];

  return (
    <div className="bg-white shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] rounded-2xl p-4 w-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-black">Estimate</h3>
        <button className="text-[#C68A53] flex items-center gap-1 text-sm">
          <EditOutlined style={{ fontSize: 12 }} /> Edit
        </button>
      </div>
      <div className="h-[200px] w-full overflow-hidden">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>

      <div className="flex justify-between mt-3">
        <div>
          <p className="text-xs text-[#6D6D6D]">Budget</p>
          <p className="font-bold text-black">0.00</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#6D6D6D]">Actual Cost</p>
          <p className="font-bold text-black">0.00</p>
        </div>
      </div>
    </div>
  );
};

export default Estimatechart;
