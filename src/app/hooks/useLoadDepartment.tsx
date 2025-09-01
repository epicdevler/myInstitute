"use client";
import { Department } from "@/lib/models/Department";
import { DepartmentRepository } from "@/lib/repositories/remote/DepartmentRepo";
import { useEffect, useState } from "react";

export function useLoadDepartment(departmentId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string>();
  const [department, setDepartment] = useState<Department>();
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const invoke = async () => {
      setLoadingError(undefined);

      const response = await new DepartmentRepository().get(departmentId);

      if (!response.success) {
        setLoadingError(response.message);
        setIsLoading(false);
        return;
      }

      setDepartment(response.data!);
      setIsLoading(false);
    };

    invoke();
  }, [departmentId, retry]);

  return {
    isLoading,
    loadingError,
    department,
    retry: () => setRetry((prev) => prev + 1),
  };
}
