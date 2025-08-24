import {
  collection,
  doc,
  documentId,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { firestoreDB } from "./config";
import { Course } from "../../models/Course";
import { DBResponse } from "@/lib/utils/DBResponse";

export class CourseRepository {
  courseCollection = collection(firestoreDB, "courses");

  async add(
    course: Omit<Course, "id" | "createdAt">
  ): Promise<DBResponse<undefined>> {
    return await runTransaction(firestoreDB, async (transaction) => {
      try {
        const courseID = course.code.replaceAll(" ", "-");
        const courseDoc = doc(this.courseCollection, courseID);
        const existing = (await transaction.get(courseDoc)).exists();

        if (existing) {
          throw new Error(`Course with ${course.code} already exists`);
        }

        transaction.set(courseDoc, {
          ...course,
          createdAt: serverTimestamp(),
        });

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          message: (error as Error).message,
        };
      }
    });
  }

  async getAll(): Promise<DBResponse<Course[]>> {
    try {
      const snapshot = await getDocs(query(this.courseCollection));

      const courses = snapshot.docs.map((_doc) => {
        const id = _doc.id;
        const data = _doc.data();
        return {
          id,
          ...(data as Omit<Course, "id">),
        };
      });
      return {
        success: true,
        data: courses,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  async getByDepartment(departmentId: string): Promise<DBResponse<Course[]>> {
    try {
      const snapshot = await getDocs(
        query(
          this.courseCollection,
          where("departmentId", "array-contains", departmentId)
        )
      );

      const courses = snapshot.docs.map((_doc) => {
        const id = _doc.id;
        const data = _doc.data();
        return {
          id,
          ...(data as Omit<Course, "id">),
        };
      });
      return {
        success: true,
        data: courses,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  async getByCourseId(courseIds: string[]): Promise<DBResponse<Course[]>> {
    try {
      if (courseIds.length < 1) {
        return {
          success: true,
          data: [],
        };
      }

      const snapshot = await getDocs(
        query(this.courseCollection, where(documentId(), "in", courseIds))
      );

      const courses = snapshot.docs.map((_doc) => {
        const id = _doc.id;
        const data = _doc.data();
        return {
          id,
          ...(data as Omit<Course, "id">),
        };
      });
      return {
        success: true,
        data: courses,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  async update(
    id: string,
    updates: Partial<Omit<Course, "id" | "departmentId" | "createdAt">>
  ): Promise<DBResponse<undefined>> {
    return await runTransaction(firestoreDB, async (transaction) => {
      try {
        const courseDoc = doc(this.courseCollection, id);

        const exists = (await transaction.get(courseDoc)).exists();

        if (!exists) {
          throw new Error("Course doesn't exist");
        }

        await transaction.update(courseDoc, updates);

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          message: (error as Error).message,
        };
      }
    });
  }

  async delete(id: string): Promise<DBResponse<never>> {
    return await runTransaction(firestoreDB, async (transaction) => {
      try {
        const courseDoc = doc(this.courseCollection, id);

        const exists = (await transaction.get(courseDoc)).exists();

        if (!exists) {
          throw new Error("Course doesn't exist");
        }
        transaction.delete(courseDoc);

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          message: (error as Error).message,
        };
      }
    });
  }
}
