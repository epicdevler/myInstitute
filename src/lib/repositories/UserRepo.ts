import bcrypt from "bcryptjs";
import { deleteCookie, setCookie } from "cookies-next";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { firebaseAuth, firestoreDB } from "../config";
import { User } from "../models/User";
import { UsersDB } from "../pouchdbConfig";

export class UserRepository {
  userCollection = collection(firestoreDB, "users");

  async signup(
    details: Omit<User, "id" | "createAt">
  ): Promise<DBResponse<User>> {
    try {
      const { user } = await createUserWithEmailAndPassword(
        firebaseAuth,
        details.email,
        details.password
      );

      await updateProfile(user!, {
        displayName: `${details.firstName} ${details.lastName}`,
      });

      const passwordHash = await bcrypt.hash(details.password, 10);

      const newUser = {
        ...details,
        password: passwordHash,
        createAt: serverTimestamp(),
      };

      const userDoc = doc(this.userCollection, user.uid);
      await setDoc(userDoc, newUser);

      await setCookie(
        "session_user_id",
        JSON.stringify({ token: await user!.getIdToken(), role: details.role }),
        {
          maxAge: 60 * 60 * 24 * 7,
        }
      );

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
      const { user } = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const userSnapshot = await getDoc(doc(this.userCollection, user!.uid));

      if (!userSnapshot.exists()) {
        throw new Error("Invalid user data, contact support");
      }

      const { role } = userSnapshot.data();

      await setCookie(
        "session_user_id",
        JSON.stringify({ token: await user!.getIdToken(), role: role }),
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
      await signOut(firebaseAuth);
      await deleteCookie("session_user_id");
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

  async getProfile(userId: string): Promise<DBResponse<User>> {
    try {
      const snapshot = await getDoc(doc(this.userCollection, userId));

      if (snapshot.exists() == false) throw new Error("User profile not found");

      const user: User = {
        id: snapshot.id,
        ...(snapshot.data() as Omit<User, "id">),
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

  async registerCourses(
    userId: string,
    courseIds: string[]
  ): Promise<DBResponse<undefined>> {
    try {
      await UsersDB.get(userId).then((user) => {
        const _user = user as unknown as Omit<User, "id">;

        console.log("_User: ", _user)
        _user.registeredCourses?.push(...courseIds);

        return UsersDB.put(_user);
      }).then(response => {
        console.log("Response: ", response)
      });
      return {
        success: false,
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
