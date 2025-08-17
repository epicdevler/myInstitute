'use client'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
} from "firebase/firestore";
import { firestoreDB } from "../config";
import { Department } from "../models/Department";
import { DepartmentsDB } from "../pouchdbConfig";
import { DBResponse } from "./UserRepo";

export class PouchDepartmentRepository {
  departmentColleciton = collection(firestoreDB, "departments");

  async add(
    department: Omit<Department, "id" | "createdAt">
  ): Promise<DBResponse<undefined>> {
    try {
      const existing =
        (
          await DepartmentsDB.find({
            selector: {
              code: { $eq: department.code },
            },
            limit: 1,
          }).then((dta) => {
            return dta;
          })
        ).docs.length > 0;

      if (existing) {
        throw new Error(`Department with ${department.code} already exists`);
      }

      const courseData = {
        _id: department.code,
        ...department,
        createdAt: new Date().toUTCString(),
      };

      await DepartmentsDB.put(courseData);
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

  async getAll(): Promise<DBResponse<Department[]>> {
    try {
      const existing = (
        await DepartmentsDB.allDocs({
          // skip: 1,
          descending: true,
          include_docs: true,
        })
      ).rows.filter((doc) => {
        return !doc.key.includes("/");
      });

      const departments: Department[] = existing.map((doc) => {
        const _doc = doc.doc as unknown as Department;

        return {
          id: doc.doc!._id,
          code: _doc.code,
          name: _doc.name,
          createdAt: new Date(_doc.createdAt),
        };
      });

      return {
        success: true,
        data: departments,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  async getAllOverview(): Promise<DBResponse<Department[]>> {
    try {
      const _query = query(this.departmentColleciton);
      const snapshots = await getDocs(_query);

      const departments = snapshots.docs.map((_doc) => {
        const data = _doc.data();

        return {
          id: _doc.id,
          ...(data as Omit<Department, "id">),
        };
      });

      return {
        success: true,
        data: departments,
      };
    } catch (error) {
      return {
        success: false,
        message: (error as Error).message,
      };
    }
  }

  async get(departmentId: string): Promise<DBResponse<Department>> {
    try {
      const snapshot = await getDoc(
        doc(this.departmentColleciton, departmentId)
      );

      if (!snapshot.exists()) {
        throw new Error("Department not found");
      }

      return {
        success: true,
        data: {
          id: snapshot.id,
          ...(snapshot.data() as Omit<Department, "id">),
        },
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
    updates: Partial<Omit<Department, "id" | "createdAt">>
  ): Promise<DBResponse<undefined>> {
    return await runTransaction(firestoreDB, async (transaction) => {
      try {
        const departmentDoc = doc(this.departmentColleciton, id);

        const exists = (await transaction.get(departmentDoc)).exists();

        if (!exists) {
          throw new Error("Course doesn't exist");
        }

        await transaction.update(departmentDoc, updates);

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
      await DepartmentsDB.get(id).then((doc) => {
        return DepartmentsDB.remove(doc);
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
