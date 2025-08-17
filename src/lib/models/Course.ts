
export interface Course {
  id: string;
  departmentId: string[];
  title: string;
  code: string;
  creditUnit: string;
  description?: string;
  createdAt: Date
}
