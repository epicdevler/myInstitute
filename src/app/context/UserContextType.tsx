import { User } from "@/lib/models/User";

export type UserContextUser = Omit<User, "password">;

export type UserContextType = {
  user?: UserContextUser;
  isLogginOut: boolean;
  setLoggingOut: (isLoggingOut: boolean) => void
};
