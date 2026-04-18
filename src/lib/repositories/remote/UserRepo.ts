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
  documentId,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QueryConstraint,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { User, UserRole } from "../../models/User";
import { firebaseAuth, firestoreDB } from "./config";

export const userCollection = collection(firestoreDB, "users");

export type UserFilterOptions = {
  userId?: string;
  role?: UserRole[];
  departmentId?: string[];
};

export class UserRepository {
  async signup(
    details: Omit<User, "id" | "createAt">,
  ): Promise<DBResponse<User>> {
    try {
      const { user } = await createUserWithEmailAndPassword(
        firebaseAuth,
        details.email,
        details.password,
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
        message: handleAuthError(error),
      };
    }
  }

  async createUser(
    details: Omit<User, "id" | "createAt">,
  ): Promise<DBResponse<never>> {
    throw Error("Not implemented");
    // try {
    //   const firebaseAuthAdmin = (
    //     await import("@/lib/repositories/remote/config.server")
    //   ).firebaseAuth;
    //   const record = await firebaseAuthAdmin.createUser({
    //     email: details.email,
    //     password: details.password,
    //     phoneNumber: details.phone,
    //     displayName:
    //       `${details?.staff?.title ?? ""} ${details.lastName}`.trim(),
    //   });

    //   const firestoreDBAdmin = (
    //     await import("@/lib/repositories/remote/config.server")
    //   ).firestoreDB;

    //   const passwordHash = await bcrypt.hash(details.password, 10);

    //   const newUser = {
    //     ...details,
    //     password: passwordHash,
    //     createAt: serverTimestamp(),
    //   };

    //   await firestoreDBAdmin
    //     .collection(userCollection.path)
    //     .doc(record.uid)
    //     .set(newUser);

    //   return { success: true };
    // } catch (error) {
    //   return {
    //     success: false,
    //     message: handleAuthError(error),
    //   };
    // }
  }

  async login(email: string, password: string): Promise<DBResponse<User>> {
    try {
      const { user } = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
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
        message: handleAuthError(error),
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
        message: handleAuthError(error),
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
        role: transfromRole(data.role),
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
    callback: (response: DBResponse<User>) => void,
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
      const data = snapshot.data();

      const user: User = {
        id: snapshot.id,
        ...(data as Omit<User, "id" | "role">),
        role: transfromRole(data.role),
        createAt: (data.createAt as Timestamp).toDate(),
      };

      callback({
        success: true,
        data: user,
      });
    });
  }

  async registerCourses(
    userId: string,
    courseIds: string[],
    type?: "CarryOver" | "SpilledOver" | "Normal",
  ): Promise<DBResponse<undefined>> {
    return runTransaction(firestoreDB, async (transaction) => {
      try {
        const userDoc = doc(userCollection, userId);
        const userSnapshot = await transaction.get(userDoc);

        if (!userSnapshot.exists()) {
          throw new Error("User doesn't exist");
        }

        const userData = userSnapshot.data() as User;

        const courseNameProp =
          type == "CarryOver"
            ? "carryOverCourses"
            : type == "SpilledOver"
              ? "spilledCourses"
              : "registeredCourses";

        const courses = userData[courseNameProp] ?? [];

        // Case 1: No incoming data
        if (courseIds.length === 0) {
          throw new Error("Can't submit no data");
        }

        // Create deduped next state
        const next = [...new Set(courseIds)];

        // Case 2: No changes (same length and same contents)
        const isSame =
          courses.length === next.length &&
          courses.every((id) => next.includes(id));

        if (isSame) {
          return {
            success: false,
            message:
              "No changes made, you didn't not add or remove from already existing courses",
          };
        }

        // Case 3: Update to exactly match incoming
        userData[courseNameProp] = next;

        transaction.update(userDoc, {
          [courseNameProp]: userData[courseNameProp],
        });

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          message: handleAuthError(error),
        };
      }
    });
  }

  async getUsers(filter: UserFilterOptions): Promise<DBResponse<User[]>> {
    try {
      const { role, userId, departmentId } = filter;
      const constraints: QueryConstraint[] = [];

      if (role) constraints.push(where("role", "in", role));
      if (userId) constraints.push(where(documentId(), "==", userId));
      if (departmentId && departmentId.length > 0)
        constraints.push(where("departmentId", "in", departmentId));

      const students = await getDocs(
        query(
          userCollection,
          ...constraints,
          where("role", "!=", process.env.NEXT_PUBLIC_SUPERADMIN_KEY),
        ),
      ).then((snapshot) => {
        return snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            ...(data as Omit<User, "id" | "createdAt" | "updatedAt">),
            createAt: (data.createAt as Timestamp).toDate(),
          };
        });
      });

      return {
        success: true,
        data: students,
      };
    } catch (error) {
      return {
        success: false,
        message: handleAuthError(error),
      };
    }
  }
}
function transfromRole(role: string): UserRole {
  return role == process.env.NEXT_PUBLIC_SUPERADMIN_KEY
    ? ("admin" as UserRole)
    : (role as UserRole);
}
