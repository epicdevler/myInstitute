"use client";
import { UserRole } from "@/lib/models/User";
import {
  UserFilterOptions,
  UserRepository,
} from "@/lib/repositories/remote/UserRepo";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const userRepoImpl = new UserRepository();

export function useLoadStudents() {
  const queryClient = useQueryClient();

  const invalidate = (/* role: UserRole */) =>
    queryClient.invalidateQueries({ queryKey: ["users"] });

  const useRequest = (filter: UserFilterOptions) =>
    useQuery({
      queryKey: ["users", filter.role, filter.userId, filter.departmentId],
      queryFn: () => userRepoImpl.getUsers(filter).then(res => {
        if(!res.success) throw Error(res.message)

          return res.data
      }),
    });
  return {
    invalidate,
    query: useRequest
  };
}
