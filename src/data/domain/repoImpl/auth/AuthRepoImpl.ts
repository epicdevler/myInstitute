import { AuthRepository } from "@/data/repo/AuthRepository";

export class AuthRepoImpl implements AuthRepository {
  private static instance: AuthRepoImpl;

  private constructor() {}
  login(username: string, password: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  register<T>(
    username: string,
    password: string,
    extraData?: T
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
  logout(token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendPasswordResetEmail(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  resetPassword(token: string, newPassword: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  changePassword(
    token: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  sendVerificationEmail(email: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  verifyEmail(token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public static getInstance(): AuthRepoImpl {
    if (!AuthRepoImpl.instance) {
      AuthRepoImpl.instance = new AuthRepoImpl();
    }
    return AuthRepoImpl.instance;
  }
}
