export type UserRole = "admin" | "student" | "staff";

export interface User {
  id: string;

  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string; // stored hash
  departmentId?: string;
  role: UserRole;
  registeredCourses?: string[]; // array of course IDs
  spilledCourses?: string[]; // array of course IDs
  carryOverCourses?: string[]; // array of course IDs
  createAt: Date;
  updatedAt?: Date;

  staff?: {
    title: string;
    id: string;
  };

  student?: {
    status: "approved" | "pending" | "declined" | "update-info";
    registeredCourses?: string[]; // array of course IDs
    spilledCourses?: string[]; // array of course IDs
    carryOverCourses?: string[]; // array of course IDs
  };
}

export const USER_COOKIE_KEY = "session_user_id";
