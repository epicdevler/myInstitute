/**
 * FakeUserDb is a singleton class that simulates a user database.
 * It provides methods to manage users, generate and store fake OTPs and email codes,
 * and allows validation of these codes for testing authentication flows.
 */

type User = {
  id: string;
  username: string;
  email: string;
  token: string;
  phoneOtp?: string;
  emailCode?: string;
  resetCode?: string; // <-- Add this field for password reset
};

function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function randomOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

function randomEmailCode(): string {
  return randomString(8);
}

function randomResetCode(): string {
  return randomString(10);
}

class FakeUserDb {
  private static instance: FakeUserDb;
  private users: User[] = [];

  private constructor() {
    // Seed with some fake users
    for (let i = 1; i <= 5; i++) {
      const token = this.generateToken();
      this.users.push({
        id: i.toString(),
        username: `user${i}`,
        email: `user${i}@example.com`,
        token,
      });
    }
  }

  static getInstance(): FakeUserDb {
    if (!FakeUserDb.instance) {
      FakeUserDb.instance = new FakeUserDb();
    }
    return FakeUserDb.instance;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  findByUsername(username: string): User | undefined {
    return this.users.find(u => u.username === username);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  findByToken(token: string): User | undefined {
    return this.users.find(u => u.token === token);
  }

  generateToken(): string {
    return randomString(24);
  }

  // Emulate sending a phone OTP and store it for the user
  sendPhoneOtp(username: string): string | undefined {
    const user = this.findByUsername(username);
    if (user) {
      user.phoneOtp = randomOtp();
      return user.phoneOtp;
    }
    return undefined;
  }

  // Emulate sending an email code and store it for the user
  sendEmailCode(email: string): string | undefined {
    const user = this.findByEmail(email);
    if (user) {
      user.emailCode = randomEmailCode();
      return user.emailCode;
    }
    return undefined;
  }

  // Emulate sending a password reset code and store it for the user
  sendPasswordResetCode(email: string): string | undefined {
    const user = this.findByEmail(email);
    if (user) {
      user.resetCode = randomResetCode();
      return user.resetCode;
    }
    return undefined;
  }

  // Validate the phone OTP for a user
  validatePhoneOtp(username: string, otp: string): boolean {
    const user = this.findByUsername(username);
    return user?.phoneOtp === otp;
  }

  // Validate the email code for a user
  validateEmailCode(email: string, code: string): boolean {
    const user = this.findByEmail(email);
    return user?.emailCode === code;
  }

  // Validate the password reset code for a user
  validatePasswordResetCode(email: string, code: string): boolean {
    const user = this.findByEmail(email);
    return user?.resetCode === code;
  }

  // Clear the password reset code after successful reset
  clearPasswordResetCode(email: string): void {
    const user = this.findByEmail(email);
    if (user) {
      user.resetCode = undefined;
    }
  }

  // Add a new user to the fake DB
  addUser(user: Omit<User, 'id' | 'token'>): User {
    const id = (this.users.length + 1).toString();
    const token = this.generateToken();
    const newUser: User = { id, token, ...user };
    this.users.push(newUser);
    return newUser;
  }
}

export default FakeUserDb;
export type { User };