
export interface Department {
  id: string; // pouchdb doc id
  name: string;
  code: string;
  createdAt: Date
}

export type DeparmentWithOverview = Department & {totalStudents: number, totalCourses: number}