"use client";
import {
  UserRepository
} from "@/lib/repositories/remote/UserRepo";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const userRepoImpl = new UserRepository();

export function useLoadProfile() {
  const queryClient = useQueryClient();

  const invalidate = (/* role: UserRole */) =>
    queryClient.invalidateQueries({ queryKey: ["profile"] });

  const useRequest = (userId?: string) =>
    useQuery({
      enabled: !!userId,
      queryKey: ["profile", userId],
      queryFn: () => userRepoImpl.getProfile(userId!).then(res => {
        if(!res.success) throw Error(res.message)

          return res.data
      }),
    });
  return {
    invalidate,
    query: useRequest
  };
}
