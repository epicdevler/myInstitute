"use client";
import { Course } from "@/lib/models/Course";
import { PouchCourseRepository } from "@/lib/repositories/PouchCourseRepo";
import { useEffect, useState } from "react";

export type FetchOption = {
  enabled: boolean;
  departmentId?: string;
  courseId?: string[];
};
export function useLoadCourses(options: FetchOption) {

  const { enabled, departmentId, courseId } = options;

  

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!enabled) return;

    setLoading(true);
    const invoke = async () => {
      const courseRepo = new PouchCourseRepository();
      const response = courseId
        ? await courseRepo.getByCourseId(courseId)
        : departmentId
          ? await courseRepo.getByDepartment(departmentId)
          : await courseRepo.getAll();

      if (!response.success) {
        setError(response.message);
        setLoading(false);
        return;
      }

      setCourses(response.data!);
      setLoading(false);
    };
    invoke();
  }, [enabled, departmentId, courseId]);

  return {
    isLoading,
    error,
    courses,
  };
}
