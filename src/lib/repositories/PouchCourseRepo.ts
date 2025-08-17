import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { v4 } from "uuid";
import { firestoreDB } from "../config";
import { Course } from "../models/Course";
import { CoursesDB } from "../pouchdbConfig";
import { DBResponse } from "./UserRepo";

export class PouchCourseRepository {
  courseCollection = collection(firestoreDB, "courses");

  async add(
    course: Omit<Course, "id" | "createdAt">
  ): Promise<DBResponse<undefined>> {
    try {
      const existing =
        (
          await CoursesDB.find({
            selector: {
              code: { $eq: course.code },
            },
            limit: 1,
          }).then((dta) => {
            return dta;
          })
        ).docs.length > 0;

      if (existing) {
        throw new Error(`Course with ${course.code} already exists`);
      }

      const courseData = {
        _id: v4(),
        ...course,
        createdAt: new Date().toUTCString(),
      };

      await CoursesDB.put(courseData);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  async getAll(): Promise<DBResponse<Course[]>> {
    try {
      const existing = (
        await CoursesDB.allDocs({
          descending: true,
          include_docs: true,
        })
      ).rows.filter((doc) => {
        return !doc.key.includes("/");
      });

      const courses: Course[] = existing.map((doc) => {
        const _doc = doc.doc as unknown as Course;

        return {
          id: doc.doc!._id,
          code: _doc.code,
          creditUnit: _doc.creditUnit,
          title: _doc.title,
          description: _doc.description,
          departmentId: _doc.departmentId,
          createdAt: new Date(_doc.createdAt),
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

      const _courses = (
        await CoursesDB.find({
          selector: {
            _id: { $in: courseIds },
          },
        })
      ).docs;

      const courses: Course[] = _courses.map((doc) => {
        const _doc = doc as unknown as Course;

        return {
          id: doc!._id,
          code: _doc.code,
          creditUnit: _doc.creditUnit,
          title: _doc.title,
          description: _doc.description,
          departmentId: _doc.departmentId,
          createdAt: new Date(_doc.createdAt),
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

  async delete(id: string): Promise<DBResponse<undefined>> {
    try {
      await CoursesDB.get(id).then((doc) => {
        return CoursesDB.remove(doc);
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
  }
}
