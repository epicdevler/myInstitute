import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDB } from "../config";
import { Department } from "../models/Department";
import { DBResponse } from "./UserRepo";

export class DepartmentRepository {
  departmentColleciton = collection(firestoreDB, "departments");

  async add(
    department: Omit<Department, "id" | "createdAt">
  ): Promise<DBResponse<undefined>> {
    return await runTransaction(firestoreDB, async (transaction) => {
      try {
        console.log("INSERTING Department");
        const departmentDoc = doc(
          this.departmentColleciton,
          department.code.replaceAll(" ", "-")
        );
        console.log("INSERTING Department 1");

        const check = await transaction.get(departmentDoc)
        const existing = check.exists();
        console.log("INSERTING Department 2");

        if (existing)
          throw new Error(`Department with ${department.code} already exist`);

        console.log("INSERTING Department 3");
        transaction.set(departmentDoc, {
          ...department,
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
    }, {maxAttempts:1});
  }

  async getAll(): Promise<DBResponse<Department[]>> {
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
    return await runTransaction(firestoreDB, async (transaction) => {
      try {
        const departmentDoc = doc(this.departmentColleciton, id);

        const exists = (await transaction.get(departmentDoc)).exists();

        if (!exists) {
          throw new Error("Course doesn't exist");
        }
        transaction.delete(departmentDoc);

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
