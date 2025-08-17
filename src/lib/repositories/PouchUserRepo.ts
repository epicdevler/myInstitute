import bcrypt from "bcryptjs";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { collection } from "firebase/firestore";
import { v4 } from "uuid";
import { firestoreDB } from "../config";
import { User, USER_COOKIE_KEY } from "../models/User";
import { UsersDB } from "../pouchdbConfig";

export class PouchUserRepository {
  userCollection = collection(firestoreDB, "users");

  async signup(
    details: Omit<User, "id" | "createAt">
  ): Promise<DBResponse<User>> {
    try {
      const existing =
        (
          await UsersDB.find({
            selector: {
              email: { $eq: details.email },
            },
            limit: 1,
          })
        ).docs.length > 0;

      if (existing) {
        throw new Error(details.email + " is already taken");
      }

      const passwordHash = await bcrypt.hash(details.password, 10);

      const newUser = {
        _id: v4(),
        ...details,
        password: passwordHash,
        createAt: new Date().toISOString(),
      };

      await UsersDB.put(newUser);

      return {
        success: true,
      };
    } catch (error) {
      await this.logout();
      return {
        success: false,
        message: handleAuthError(error as Error),
      };
    }
  }

  async login(email: string, password: string): Promise<DBResponse<User>> {
    try {
      const storedUser = (
        await UsersDB.find({
          selector: {
            email: { $eq: email },
          },
          limit: 1,
        })
      ).docs;

      if (storedUser.length == 0) {
        throw new Error("Incorrect email or password");
      }

      const user = storedUser[0] as unknown as Omit<User, "createAt">;

      const validPassword = await bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        throw new Error("Incorrect email or password");
      }

      await setCookie(
        USER_COOKIE_KEY,
        JSON.stringify({ token: storedUser[0]._id, role: user.role }),
        {
          maxAge: 60 * 60 * 24 * 7,
        }
      ); // 7 days

      return {
        success: true,
      };
    } catch (error) {
      await this.logout();
      return {
        success: false,
        message: handleAuthError(error as Error),
      };
    }
  }

  async logout() {
    try {
      await deleteCookie(USER_COOKIE_KEY);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: handleAuthError(error as Error),
      };
    }
  }

  async getProfile(): Promise<DBResponse<User>> {
    try {
      const cookie = await getCookie(USER_COOKIE_KEY);

      if (!cookie) {
        throw new Error("Unauthorized access, refresh your browser.");
      }
      const { token } = JSON.parse(cookie);

      const storedUser = await UsersDB.get(token);
      const _user = storedUser as unknown as Omit<User, "id" | "createAt"> & {
        createAt: string;
      };
      const user: User = {
        id: storedUser._id,
        createAt: new Date(_user.createAt),
        firstName: _user.firstName,
        lastName: _user.lastName,
        email: _user.email,
        password: _user.password,
        departmentId: _user.departmentId,
        registeredCourses: _user.registeredCourses,
        role: _user.role,
      };

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  async getRegisteredCourses(): Promise<DBResponse<string[]>> {
    try {
      const cookie = await getCookie(USER_COOKIE_KEY);

      if (!cookie) {
        throw new Error("Unauthorized access, refresh your browser.");
      }
      const { token } = JSON.parse(cookie);

      const storedUser = await UsersDB.get(token);
      const _user = storedUser as unknown as Omit<User, "id" | "createAt">;

      return {
        success: true,
        data: _user.registeredCourses,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  async registerCourses(
    userId: string,
    courseIds: string[]
  ): Promise<DBResponse<undefined>> {
    try {
      const user = await UsersDB.get(userId);
      const _user = user as unknown as User; // keep _id and _rev

      const registered = _user.registeredCourses ?? [];

      // Case 1: No incoming data
      if (courseIds.length === 0) {
        throw new Error("Can't submit no data");
      }

      // Create deduped next state
      const next = [...new Set(courseIds)];

      // Case 2: No changes (same length and same contents)
      const isSame =
        registered.length === next.length &&
        registered.every((id) => next.includes(id));

      if (isSame) {
        throw new Error("No changes made");
      }

      // Case 3: Update to exactly match incoming
      _user.registeredCourses = next;

      // console.log("Updated registeredCourses:", _user.registeredCourses);
      // // Save back to PouchDB (must include _id and _rev)
      await UsersDB.put(_user);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: handleAuthError(error as Error),
      };
    }
  }
}

export interface DBResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export function handleAuthError(error: Error): string {
  console.log("Error: ", error);

  return (error as Error).message;
}
