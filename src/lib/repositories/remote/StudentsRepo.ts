import { User } from "@/lib/models/User";
import { DBResponse } from "@/lib/utils/DBResponse";
import { handleAuthError } from "@/lib/utils/handleAuthError";
import { getDocs, query, where } from "firebase/firestore";
import { userCollection, UserRepository } from "./UserRepo";

export const StudentRepository = {
  // Define methods for student repository here
  getStudentById: async (studentId: string) =>
    await new UserRepository().getProfile(studentId),

  getAllStudents: async (): Promise<DBResponse<User[]>> => {
    try {
      const students = await getDocs(
        query(userCollection, where("role", "==", "student"))
      ).then((snapshot) =>
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">),
        }))
      );

      return {
        success: true,
        data: students,
      };
    } catch (error) {
      return {
        success: false,
        message: handleAuthError(error as Error),
      };
    }
  },
};
