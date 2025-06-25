import { AuthRepository } from "@/data/repo/AuthRepository";
import FakeUserDb from "./userDb";
import {
  InvalidCredentialsException,
  UserAlreadyExistsException,
  UserNotFoundException,
  UnauthorizedException,
} from "@/data/utils/exceptions";

export class AuthRepoImpl implements AuthRepository {
  private static instance: AuthRepoImpl;
  private db = FakeUserDb.getInstance();

  private constructor() {}

  async login(username: string, password: string): Promise<string> {
    // For fake DB, password is always "password"
    const user = this.db.findByUsername(username);
    if (!user) throw new UserNotFoundException("User not found");
    if (password !== "password") throw new InvalidCredentialsException("Invalid password");
    return user.token;
  }

  async register<T>(username: string, password: string, extraData?: T): Promise<string> {
    if (this.db.findByUsername(username)) {
      throw new UserAlreadyExistsException("Username already exists");
    }
    const email = extraData && (extraData as unknown).email
      ? (extraData as unknown).email
      : `${username}@example.com`;
    const user = this.db.addUser({ username, email });
    return user.token;
  }

  async logout(token: string): Promise<void> {
    // No-op for fake DB
    return;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = this.db.findByEmail(email);
    if (!user) throw new UserNotFoundException("User not found");
    this.db.sendEmailCode(email);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = this.db.findByToken(token);
    if (!user) throw new UnauthorizedException("Invalid token");
    // No real password storage in fake DB
    return;
  }

  async changePassword(token: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = this.db.findByToken(token);
    if (!user) throw new UnauthorizedException("Invalid token");
    // No real password storage in fake DB
    return;
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const user = this.db.findByEmail(email);
    if (!user) throw new UserNotFoundException("User not found");
    this.db.sendEmailCode(email);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = this.db.findByToken(token);
    if (!user) throw new UnauthorizedException("Invalid token");
    // No real verification in fake DB
    return;
  }

  public static getInstance(): AuthRepoImpl {
    if (!AuthRepoImpl.instance) {
      AuthRepoImpl.instance = new AuthRepoImpl();
    }
    return AuthRepoImpl.instance;
  }
}