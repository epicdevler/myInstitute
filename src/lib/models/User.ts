export type UserRole = "admin" | "student";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // stored hash
  departmentId: string;
  role: UserRole;
  registeredCourses: string[]; // array of course IDs
  spilledCourses?: string[]; // array of course IDs
  carryOverCourses?: string[]; // array of course IDs
  createAt: Date;
}

export const USER_COOKIE_KEY = "session_user_id";
