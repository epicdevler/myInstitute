import { Course } from "@/lib/models/Course";
import { useMemo } from "react";

export default function useGroupCourse(courses: Course[]) {
  return useMemo(() => {
    const grouped = new Map<string, Course[]>();

    for (const course of courses.sort((a, b) => {
      if(a.semester.toLocaleLowerCase() === "first"){
        return -1
      }
      else if(b.semester.toLocaleLowerCase() == "second"){
        return 1
      }
      else{
        return 2
      }
    })) {
      if (grouped.has(course.semester)) {
        grouped.get(course.semester)?.push(course);
      } else {
        grouped.set(course.semester, [course]);
      }
    }
    return grouped;
  }, [courses]);
}
