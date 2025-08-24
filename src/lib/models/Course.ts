export interface Course {
  id: string;
  departmentId: string[];
  title: string;
  code: string;
  creditUnit: string;
  description?: string;
  level: Level;
  semester: Semester;
  createdAt: Date;
}
const Level = {
  // HND_I: "HND I",
  // HND_II: "HND II",
  ND_I: "ND I",
  ND_II: "ND II",
} as const;

const Semester = {
  First: "First",
  Second: "Second",
  // Third: "Third",
  // Forth: "Forth",
} as const;

export type Level = (typeof Level)[keyof typeof Level];
export type Semester = (typeof Semester)[keyof typeof Semester];

export const SemesterList = Object.values(Semester);
export const LevelList = Object.values(Level);
