"use client";
import { Course, LevelList } from "@/lib/models/Course";
import React, { useCallback } from "react";


export function useLevelFilter(courses: Course[]) {
  const [level, setLevel] = React.useState<string>(LevelList[0]);

  const filteredCourses = React.useMemo(() => {
    if (!level) return courses;

    return courses.filter((course) => {
      return course.level.replace("-", " ") === level;
    });
  }, [courses, level]);

  const onSelect = useCallback((selectedLevel: string) => {
    setLevel(selectedLevel);
  }, []);

  return {
    filteredCourses,
    level,
    onSelect,
  };
}
