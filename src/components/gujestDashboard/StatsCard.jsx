import { Card } from "antd";
import { Fragment } from "react";
import { toAbsoluteUrl } from "@/utils";
import { CommonHexagonBadge } from "@/partials/common";

export default function StatsCard({ icon, title, value, subStats }) {
  return (
    <Fragment>
      <style>
              {`
                .user-access-bg {
                  background-image: url('${toAbsoluteUrl("/images/bg_01.png")}');
                }
                .dark .user-access-bg {
                  background-image: url('${toAbsoluteUrl("/images/bg_01_dark.png")}');
                }
              `}
            </style>

    <Card
      className="rounded-2xl shadow-[6px_6px_54px_0px_#0000000D] rtl:[background-position:-240px_center] [background-position:40px_center] bg-no-repeat bg-[length:500px] bg-[url('/images/bg_01.png')] user-access-bg bg-gradient-to-r from-[#fffaf5] to-white
shadow-lg
rounded-xl"
      bodyStyle={{ padding: "0px" }}
    >
      <div className="flex items-center p-[20px] justify-between gap-4 mb-10">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-3xl font-bold text-[#8B4513]">{value}</p>
        </div>
        
        <CommonHexagonBadge
                  stroke="stroke-danger-clarity"
                  fill="fill-light"
                  size="size-[60px]"
                  badge={icon}
                />
      </div>
      <div className="flex gap-4 justify-around mt-4 bg-[#F6F1ED] rounded-t-2xl">
  {subStats?.map((stat, i) => (
    <div
      key={i}
      className={`flex flex-col items-center px-3 py-2 rounded-lg  min-w-[100px] transition-all duration-300  ${
        stat.label === "Groom"
          ? " " // Blue theme
          : " " // Pink theme
      }`}
    >
      <span className="text-xs uppercase tracking-wider font-bold opacity-90">
        {stat.label}
      </span>
      <span className="text-lg font-semibold">{stat.value}</span>
    </div>
  ))}
</div>




    </Card>
    </Fragment>
  );
}
