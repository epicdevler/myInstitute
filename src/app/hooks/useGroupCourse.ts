import { Course } from "@/lib/models/Course";
import { useMemo } from "react";

export default function useGroupCourse(courses: Course[]) {
  return useMemo(() => {
    const grouped = new Map<string, Course[]>();

    for (const course of courses) {
      if (grouped.has(course.semester)) {
        grouped.get(course.semester)?.push(course);
      } else {
        grouped.set(course.semester, [course]);
      }
    }
    return grouped;
  }, [courses]);
}
