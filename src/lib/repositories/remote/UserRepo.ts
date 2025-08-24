"use client";
import { DBResponse } from "@/lib/utils/DBResponse";
import { handleAuthError } from "@/lib/utils/handleAuthError";
import { UserCookieHandler } from "@/lib/utils/UserCookie";
import bcrypt from "bcryptjs";
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
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { User } from "../../models/User";
import { firebaseAuth, firestoreDB } from "./config";

export const userCollection = collection(firestoreDB, "users");

export class UserRepository {
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

      const userDoc = doc(userCollection, user.uid);
      await setDoc(userDoc, newUser);
      return await this.logout();
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
      const userSnapshot = await getDoc(doc(userCollection, user!.uid));

      if (!userSnapshot.exists()) {
        throw new Error("Invalid user data, contact support");
      }

      const { role } = userSnapshot.data();

      await UserCookieHandler.save(role, await user!.getIdToken());

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
      await UserCookieHandler.delete();
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
      const snapshot = await getDoc(doc(userCollection, userId));

      if (snapshot.exists() == false) throw new Error("User profile not found");

      const data = snapshot.data();
      const user: User = {
        id: snapshot.id,
        ...(data as Omit<User, "id" | "createAt">),
        createAt: (data.createAt as Timestamp).toDate(),
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

  async getProfileObserve(
    userId: string,
    callback: (response: DBResponse<User>) => void
  ): Promise<() => void> {
    const userDoc = doc(userCollection, userId);
    return onSnapshot(userDoc, (snapshot) => {
      if (snapshot.exists() == false) {
        callback({
          success: false,
          message: "User profile not found",
        });
        return;
      }

      const user: User = {
        id: snapshot.id,
        ...(snapshot.data() as Omit<User, "id">),
      };

      callback({
        success: true,
        data: user,
      });
    });
  }

  async registerCourses(
    userId: string,
    courseIds: string[]
  ): Promise<DBResponse<undefined>> {
    return runTransaction(firestoreDB, async (transaction) => {
      try {
        const userDoc = doc(userCollection, userId);
        const userSnapshot = await transaction.get(userDoc);

        if (!userSnapshot.exists()) {
          throw new Error("User doesn't exist");
        }

        const userData = userSnapshot.data() as User;

        const registered = userData.registeredCourses ?? [];

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
        userData.registeredCourses = next;

        transaction.update(userDoc, {
          registeredCourses: userData.registeredCourses,
        });

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          message: handleAuthError(error as Error),
        };
      }
    });
  }
}
