"use client";
import { User } from "@/lib/models/User";
import { StudentRepository } from "@/lib/repositories/remote/StudentsRepo";
import React from "react";


export function useLoadStudents(departmentId?: string) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadingError, setLoadingError] = React.useState<string | undefined>();
  const [students, setStudents] = React.useState<User[]>([]);

  React.useEffect(() => {
    setIsLoading(true);
    setLoadingError(undefined);

    const request = !departmentId
      ? StudentRepository.getAllStudents()
      : StudentRepository.getAllByDepartment(departmentId);

    request.then((res) => {
      if (res.success && res.data) {
        setStudents(res.data);
      } else {
        setLoadingError(res.message || "Failed to load students");
      }
      setIsLoading(false);
    });
  }, [departmentId]);

  return {
    isLoading,
    loadingError,
    students,
  };
}
