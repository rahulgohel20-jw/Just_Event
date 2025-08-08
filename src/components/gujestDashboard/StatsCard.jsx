import { Card } from "antd";

export default function StatsCard({ icon, title, value, subStats }) {
  return (
    <Card
      className="rounded-2xl shadow-[6px_6px_54px_0px_#0000000D]"
      bodyStyle={{ padding: "20px" }}
    >
      <div className="flex items-center justify-between gap-4 mb-10">
        <div>
          <h3 className="text-[#202224] font-semibold">{title}</h3>
          <p className="text-2xl font-bold text-[#202224]">{value}</p>
        </div>
        <div className="w-12 h-12 flex items-center justify-center ">
          {icon}
        </div>
      </div>
      <div className="flex gap-4 text-sm text-gray-500 justify-around">
        {subStats?.map((stat, i) => (
          <span key={i} className="text-black">
            <span className="font-semibold">{stat.label}</span> {stat.value}
          </span>
        ))}
      </div>
    </Card>
  );
}
