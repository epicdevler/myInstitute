import { AuthRepository } from "@/data/repo/AuthRepository";
import { AuthRepoImpl } from "../repoImpl/auth/AuthRepoImpl";

let userRepoInstance: AuthRepository | null = null;

export const getUserRepository = (): AuthRepository => {
  if (userRepoInstance) return userRepoInstance;

  userRepoInstance =
    process.env.NODE_ENV === 'development'
      ? AuthRepoImpl.getInstance()
      : AuthRepoImpl.getInstance();

  return userRepoInstance;
};