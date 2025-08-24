"use client";
import { Department } from "@/lib/models/Department";
import { DepartmentRepository } from "@/lib/repositories/remote/DepartmentRepo";
import { useEffect, useState } from "react";

export function useLoadDepartments() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string>();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const invoke = async () => {
      setLoadingError(undefined);

      const response = await new DepartmentRepository().getAll();

      if (!response.success) {
        setLoadingError(response.message);
        setIsLoading(false);
        return;
      }

      setDepartments(response.data!);
      setIsLoading(false);
    };

    invoke();
  }, [retry]);

  return {
    isLoading,
    loadingError,
    departments,
    retry: () => setRetry((prev) => prev + 1),
  };
}
