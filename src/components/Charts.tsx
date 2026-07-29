import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { completionSplit, departmentProjects, monthlyRelease, stateSpending } from "@/data/mock";

const axis = { stroke: "oklch(0.75 0.03 268)", fontSize: 12 };
const tooltipStyle = {
  background: "oklch(0.19 0.05 272)",
  border: "1px solid oklch(1 0 0 / 14%)",
  borderRadius: 12,
  color: "oklch(0.98 0.005 260)",
  fontSize: 12,
};

export function MonthlyReleaseChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={monthlyRelease} margin={{ left: -18, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="g-rel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.65 0.2 262)" stopOpacity={0.7} />
            <stop offset="100%" stopColor="oklch(0.65 0.2 262)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="g-lock" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.66 0.21 305)" stopOpacity={0.6} />
            <stop offset="100%" stopColor="oklch(0.66 0.21 305)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} {...axis} />
        <YAxis tickLine={false} axisLine={false} {...axis} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "oklch(1 0 0 / 18%)" }} />
        <Area type="monotone" dataKey="locked" stroke="oklch(0.66 0.21 305)" fill="url(#g-lock)" strokeWidth={2} />
        <Area type="monotone" dataKey="released" stroke="oklch(0.65 0.2 262)" fill="url(#g-rel)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DepartmentChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={departmentProjects} layout="vertical" margin={{ left: 30, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} {...axis} />
        <YAxis type="category" dataKey="department" tickLine={false} axisLine={false} width={92} {...axis} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 6%)" }} />
        <Bar dataKey="projects" radius={[0, 8, 8, 0]} fill="oklch(0.65 0.2 275)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

const pieColors = [
  "oklch(0.72 0.15 165)",
  "oklch(0.65 0.2 262)",
  "oklch(0.79 0.16 78)",
  "oklch(0.62 0.22 22)",
];

export function CompletionChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={completionSplit} dataKey="value" innerRadius={62} outerRadius={95} paddingAngle={4} stroke="none">
          {completionSplit.map((entry, i) => (
            <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function StateSpendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={stateSpending} margin={{ left: -18, right: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" vertical={false} />
        <XAxis dataKey="state" tickLine={false} axisLine={false} {...axis} />
        <YAxis tickLine={false} axisLine={false} {...axis} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 6%)" }} />
        <Bar dataKey="spend" radius={[8, 8, 0, 0]} fill="oklch(0.66 0.21 300)" />
      </BarChart>
    </ResponsiveContainer>
  );
}