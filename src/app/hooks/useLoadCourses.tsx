"use client";
import { CourseRepository } from "@/lib/repositories/remote/CourseRepo";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export type FetchOption = {
  enabled: boolean;
  departmentId?: string;
  courseId?: string[];
};

const courseRepo = new CourseRepository();

export function useLoadCourses() {
  const queryClient = useQueryClient();

  const useRequest = ({ enabled, departmentId, courseId }: FetchOption) =>
    useQuery({
      enabled: enabled,
      queryKey: ["courses", departmentId, courseId],
      queryFn: async () => {
        const response = await (courseId
          ? courseRepo.getByCourseId(courseId)
          : departmentId
            ? courseRepo.getByDepartment(departmentId)
            : courseRepo.getAll());

        if (!response.success) throw Error(response.message);

        return response.data;
      },
    });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["courses"] });

  return {
    query: useRequest,
    invalidate,
  };
}
