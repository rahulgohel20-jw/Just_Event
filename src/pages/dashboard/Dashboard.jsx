import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CalendarDays,
  Ticket,
  Mail,
  Wallet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
} from "lucide-react";

// ---- mock data -------------------------------------------------------
// tone drives the card's tint + the icon badge color, matching the reference design
const stats = [
  { label: "Active Events", value: "16", delta: "8%", icon: CalendarDays, tone: "peach" },
  { label: "Total Estimate", value: "6,240", delta: "8%", icon: Ticket, tone: "mint" },
  { label: "RSVPs", value: "205", delta: "7%", icon: Mail, tone: "lavender" },
  { label: "Total Earning", value: "$3,275.18", delta: "7%", icon: Wallet, tone: "gray" },
];

const STAT_TONES = {
  peach: { card: "bg-[#FFF0F2]", badge: "bg-[#E8B9D0]" },
  mint: { card: "bg-[#e6eff6]", badge: "bg-[#117A8B]" },
  lavender: { card: "bg-[#FFF8E1]", badge: "bg-[#e0a800]" },
  gray: { card: "bg-gray-100", badge: "bg-gray-400" },
};

const earnings = [
  { month: "Jan", value: 5200 },
  { month: "Feb", value: 8100 },
  { month: "Mar", value: 9800 },
  { month: "Apr", value: 12400 },
  { month: "May", value: 15600 },
  { month: "Jun", value: 13200 },
  { month: "Jul", value: 10400 },
  { month: "Aug", value: 22400 },
  { month: "Sep", value: 17800 },
  { month: "Oct", value: 19600 },
  { month: "Nov", value: 21200 },
  { month: "Dec", value: 25800 },
];

const bookings = [
  { month: "Jan", booked: 40, cancelled: 8 },
  { month: "Feb", booked: 32, cancelled: 6 },
  { month: "Mar", booked: 55, cancelled: 12 },
  { month: "Apr", booked: 96, cancelled: 10 },
  { month: "May", booked: 120, cancelled: 14 },
  { month: "Jun", booked: 60, cancelled: 9 },
  { month: "Jul", booked: 88, cancelled: 18 },
  { month: "Aug", booked: 92, cancelled: 10 },
  { month: "Sep", booked: 70, cancelled: 8 },
  { month: "Oct", booked: 58, cancelled: 7 },
  { month: "Nov", booked: 66, cancelled: 6 },
  { month: "Dec", booked: 74, cancelled: 9 },
];

// pie colors: primary, black, and a lighter tint of primary for "Pending"
const guestInvitations = [
  { name: "Accepted", value: 1251, colorClass: "text-primary" },
  { name: "Declined", value: 834, colorClass: "text-black" },
  { name: "Pending", value: 695, colorClass: "text-primary/40" },
];
const totalSent = guestInvitations.reduce((a, b) => a + b.value, 0);

// ---- small building blocks -------------------------------------------

const Dropdown = ({ label }) => (
  <button
    type="button"
    className="flex items-center gap-1 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black/70"
  >
    {label}
    <ChevronDown size={13} />
  </button>
);

const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-primary bg-white p-5 shadow-sm ${className}`}>
    {children}
  </div>
);

const StatCard = ({ label, value, delta, icon: Icon, tone = "gray" }) => {
  const { card, badge } = STAT_TONES[tone];
  return (
    <div className={`flex items-center justify-between rounded-2xl p-5 ${card}`}>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-black/60">{label}</p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-black">{value}</span>
         
        </div>
      </div>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${badge}`}>
        <Icon size={19} />
      </div>
    </div>
  );
};

const EarningsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white shadow-lg">
      {label}: ${payload[0].value.toLocaleString()}
    </div>
  );
};

const BookingsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const booked = payload.find((p) => p.dataKey === "booked");
  const cancelled = payload.find((p) => p.dataKey === "cancelled");
  return (
    <div className="flex gap-2">
      {booked && (
        <div className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
          {booked.value} Bookings
        </div>
      )}
      {cancelled && (
        <div className="rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
          {cancelled.value} Cancelled
        </div>
      )}
    </div>
  );
};

// ---- calendar ----------------------------------------------------------

function MiniCalendar() {
  const [cursor, setCursor] = useState(new Date(2025, 9, 1)); // October 2025
  const highlighted = new Set([1, 17, 21]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthLabel = cursor.toLocaleString("en-US", { month: "long" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, muted: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, muted: false });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    cells.push({ day: cells.length - (firstDay + daysInMonth) + 1, muted: true });
    if (cells.length >= 42) break;
  }

  const shiftMonth = (dir) => setCursor(new Date(year, month + dir, 1));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <button onClick={() => shiftMonth(-1)} className="text-black/30 hover:text-black">
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold text-black">
          {monthLabel} {year}
        </p>
        <button onClick={() => shiftMonth(1)} className="text-black/30 hover:text-black">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="text-[11px] font-semibold text-black/30">
            {d}
          </span>
        ))}
        {cells.map((c, i) => {
          const isHighlighted = !c.muted && highlighted.has(c.day);
          return (
            <div key={i} className="flex items-center justify-center py-0.5">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[13px] ${
                  c.muted
                    ? "text-black/20"
                    : isHighlighted
                    ? "bg-primary font-semibold text-white"
                    : "font-medium text-black/70"
                }`}
              >
                {c.day}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---- main dashboard ------------------------------------------------------

export default function EventDashboard() {
  return (
    <div className="min-h-screen w-full bg-white p-6">
      <div className="mx-auto max-w-[1200px] space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Earnings + Guest invitations */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.7fr_1fr]">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-black/50">Total Earnings</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-black">$</span>
                  <span className="text-3xl font-bold text-black">63,423.13</span>
                </div>
                <p className="mt-1 text-xs font-medium text-primary">
                  +$22,711 (12.3%) <span className="text-black/40">&bull; last 4 months</span>
                </p>
              </div>
              <Dropdown label="All Events" />
            </div>

            <div className="mt-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earnings} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" className="text-primary" stopColor="currentColor" stopOpacity={0.25} />
                      <stop offset="100%" className="text-primary" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, className: "fill-black/40" }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, className: "fill-black/40" }}
                    tickFormatter={(v) => `$${v / 1000}K`}
                    width={40}
                  />
                  <Tooltip content={<EarningsTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    className="text-primary"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    fill="url(#earningsFill)"
                    dot={false}
                    activeDot={{ className: "text-primary fill-primary stroke-white", strokeWidth: 2, r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-black/50">Guest Invitations</p>
              <Dropdown label="All Events" />
            </div>

            <div className="relative mx-auto mt-2 h-[170px] w-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={guestInvitations}
                    dataKey="value"
                    innerRadius={58}
                    outerRadius={78}
                    paddingAngle={3}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {guestInvitations.map((g) => (
                      <Cell key={g.name} className={g.colorClass} fill="currentColor" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[11px] font-medium text-black/40">Total Sent</p>
                <p className="text-2xl font-bold text-black">{totalSent.toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {guestInvitations.map((g) => {
                const pct = Math.round((g.value / totalSent) * 100);
                return (
                  <div key={g.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full bg-current ${g.colorClass}`} />
                      <span className="text-black/60">{g.name}</span>
                      <span className="font-semibold text-black">{g.value.toLocaleString()}</span>
                    </div>
                    <span className="rounded-md bg-black/5 px-2 py-0.5 text-xs font-semibold text-black/50">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Bookings + Calendar */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.7fr_1fr]">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-black/50">Total Bookings and Cancelations</p>
                <p className="mt-1 text-3xl font-bold text-black">174,463</p>
                <p className="mt-1 text-xs font-medium text-primary">
                  +12,325 (10.2%) <span className="text-black/40">&bull; last 4 months</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Dropdown label="All Events" />
                <Dropdown label="All Year" />
              </div>
            </div>

            <div className="mt-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookings} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={4}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, className: "fill-black/40" }}
                    dy={8}
                  />
                  <YAxis hide />
                  <Tooltip content={<BookingsTooltip />} cursor={{ className: "fill-black/5" }} />
                  <Bar dataKey="cancelled" className="text-black" fill="currentColor" radius={[4, 4, 4, 4]} barSize={10} />
                  <Bar dataKey="booked" className="text-primary" fill="currentColor" radius={[4, 4, 4, 4]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <MiniCalendar />
        </div>
      </div>
    </div>
  );
}