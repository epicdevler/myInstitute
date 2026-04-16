import { User } from "@/lib/models/User";
import { DBResponse } from "@/lib/utils/DBResponse";
import { handleAuthError } from "@/lib/utils/handleAuthError";
import {
  and,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { userCollection, UserRepository } from "./UserRepo";
import { firestoreDB } from "./config";

export const StudentRepository = {
  // Define methods for student repository here
  getStudentById: async (studentId: string) =>
    await new UserRepository().getProfile(studentId),

  getAllStudents: async (): Promise<DBResponse<User[]>> => {
    try {
      const students = await getDocs(
        query(userCollection, where("role", "==", "student")),
      ).then((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">),
        })),
      );

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
  },

  getAllByDepartment: async (
    departmentId: string,
  ): Promise<DBResponse<User[]>> => {
    try {
      const students = await getDocs(
        query(
          userCollection,
          and(
            where("role", "==", "student"),
            where("departmentId", "==", departmentId),
          ),
        ),
      ).then((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">),
        })),
      );

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
  },

  updateStudentStatus: async (
    studentId: string,
    status: "approved" | "declined",
  ): Promise<DBResponse<never>> => {
    return runTransaction(firestoreDB, async (trans) => {
      try {
        const studentDoc = doc(firestoreDB, "users", studentId);

        const response = await trans.get(studentDoc);
        console.log("StudentDoc: ", response);

        if (!response.exists()) {
          throw Error("Failed to update status, student not found.");
        }
        trans.update(studentDoc, { student: { status: status } });

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
  },
};
