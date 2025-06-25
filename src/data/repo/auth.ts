export interface AuthRepository {

    /**
     * Login a user with username and password.
     * @param username 
     * @param password 
     */
  login(username: string, password: string): Promise<string>;

  /**
   * Register a new user with username, password, and optional extra data.
   * @param username 
   * @param password 
   * @param extraData Optional additional data for the user.
   */
  register<T>(username: string, password: string, extraData?: T): Promise<string>;


  /**
   * Logout a user by invalidating their token.
   * @param token The authentication token to invalidate.
   */
  logout(token: string): Promise<void>;

  /**
   * Send Password Reset Email
   * @param email 
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Reset Password
   * @param token 
   * @param newPassword 
   */
  resetPassword(token: string, newPassword: string): Promise<void>;

  /**
   * Change Password
   * @param token 
   * @param oldPassword 
   * @param newPassword 
   */
  changePassword(token: string, oldPassword: string, newPassword: string): Promise<void>;

  /**
   * Send Verification Email
   * @param email 
   */
  sendVerificationEmail(email: string): Promise<void>;

  /**
   * Verify Email
   * @param token 
   */
  verifyEmail(token: string): Promise<void>;
}