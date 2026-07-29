export type ProjectStatus = "Active" | "Completed" | "Pending Verification" | "Delayed";

export interface Project {
  id: string;
  name: string;
  department: string;
  state: string;
  budget: number;
  released: number;
  status: ProjectStatus;
  progress: number;
  updated: string;
  contractor: string;
}

export const projects: Project[] = [
  { id: "JSC-1041", name: "Rural Road Corridor - Phase II", department: "Rural Development", state: "Maharashtra", budget: 42000000, released: 28500000, status: "Active", progress: 68, updated: "2026-07-24", contractor: "Sahyadri Infra Pvt Ltd" },
  { id: "JSC-1042", name: "Smart Water Grid, Jaipur", department: "Jal Shakti", state: "Rajasthan", budget: 76500000, released: 76500000, status: "Completed", progress: 100, updated: "2026-07-18", contractor: "Marudhara Utilities" },
  { id: "JSC-1043", name: "District Hospital Upgrade", department: "Health & Family Welfare", state: "Kerala", budget: 51200000, released: 22000000, status: "Pending Verification", progress: 43, updated: "2026-07-27", contractor: "Nair Buildcon" },
  { id: "JSC-1044", name: "Solar Microgrid Cluster", department: "New & Renewable Energy", state: "Gujarat", budget: 98000000, released: 61000000, status: "Active", progress: 62, updated: "2026-07-26", contractor: "Suryodaya Energy" },
  { id: "JSC-1045", name: "Model Schools Retrofit", department: "Education", state: "Uttar Pradesh", budget: 33400000, released: 12800000, status: "Delayed", progress: 31, updated: "2026-07-11", contractor: "Ganga Constructions" },
  { id: "JSC-1046", name: "Metro Feeder Depot", department: "Urban Affairs", state: "Karnataka", budget: 124000000, released: 88000000, status: "Active", progress: 71, updated: "2026-07-28", contractor: "Deccan Mobility" },
  { id: "JSC-1047", name: "Coastal Flood Barrier", department: "Disaster Management", state: "Odisha", budget: 87500000, released: 39000000, status: "Active", progress: 45, updated: "2026-07-22", contractor: "Kalinga Marine Works" },
  { id: "JSC-1048", name: "Anganwadi Nutrition Centres", department: "Women & Child Development", state: "Bihar", budget: 21600000, released: 21600000, status: "Completed", progress: 100, updated: "2026-06-30", contractor: "Maithili Seva Nirman" },
  { id: "JSC-1049", name: "Fibre Backbone - Tier 3 Towns", department: "Electronics & IT", state: "Madhya Pradesh", budget: 64300000, released: 30500000, status: "Pending Verification", progress: 52, updated: "2026-07-25", contractor: "Narmada Networks" },
  { id: "JSC-1050", name: "Cold Chain Warehousing", department: "Agriculture", state: "Punjab", budget: 45900000, released: 27400000, status: "Active", progress: 59, updated: "2026-07-20", contractor: "Sutlej Agro Logistics" },
  { id: "JSC-1051", name: "Tribal Skill Development Hub", department: "Tribal Affairs", state: "Jharkhand", budget: 29800000, released: 9800000, status: "Delayed", progress: 26, updated: "2026-07-09", contractor: "Chotanagpur Works" },
  { id: "JSC-1052", name: "Riverfront Sewage Treatment", department: "Jal Shakti", state: "West Bengal", budget: 110500000, released: 74300000, status: "Active", progress: 67, updated: "2026-07-27", contractor: "Hooghly Enviro" },
];

export const monthlyRelease = [
  { month: "Feb", released: 210, locked: 380 },
  { month: "Mar", released: 265, locked: 410 },
  { month: "Apr", released: 320, locked: 395 },
  { month: "May", released: 298, locked: 440 },
  { month: "Jun", released: 405, locked: 465 },
  { month: "Jul", released: 486, locked: 502 },
];

export const departmentProjects = [
  { department: "Jal Shakti", projects: 42 },
  { department: "Urban Affairs", projects: 36 },
  { department: "Health", projects: 31 },
  { department: "Education", projects: 27 },
  { department: "Energy", projects: 23 },
  { department: "Agriculture", projects: 18 },
];

export const completionSplit = [
  { name: "Completed", value: 38 },
  { name: "Active", value: 41 },
  { name: "Pending Verification", value: 14 },
  { name: "Delayed", value: 7 },
];

export const stateSpending = [
  { state: "MH", spend: 812 },
  { state: "UP", spend: 744 },
  { state: "KA", spend: 690 },
  { state: "GJ", spend: 655 },
  { state: "TN", spend: 612 },
  { state: "WB", spend: 540 },
  { state: "RJ", spend: 488 },
];

export const milestones = [
  { title: "Site survey & mobilisation", date: "12 Mar 2026", status: "Verified", amount: 4200000 },
  { title: "Earthwork and sub-base", date: "28 Apr 2026", status: "Verified", amount: 8600000 },
  { title: "Drainage & culverts", date: "19 Jun 2026", status: "Verified", amount: 7900000 },
  { title: "Bituminous surfacing", date: "24 Jul 2026", status: "Under review", amount: 7800000 },
  { title: "Signage, safety & handover", date: "Planned Sep 2026", status: "Locked", amount: 6500000 },
];

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 1,
    notation: "compact",
  }).format(value);