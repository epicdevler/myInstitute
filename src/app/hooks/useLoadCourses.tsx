"use client";
import { Course } from "@/lib/models/Course";
import { CourseRepository } from "@/lib/repositories/remote/CourseRepo";
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
  const [retry, setRetry] = useState<number>(0);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!enabled) return;

    setLoading(true);
    const invoke = async () => {
      const courseRepo = new CourseRepository();
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
  }, [enabled, departmentId, retry, courseId]);

  return {
    isLoading,
    error,
    courses,
    onRetry: () => setRetry((prev) => prev + 1),
  };
}
