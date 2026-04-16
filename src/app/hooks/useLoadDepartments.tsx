"use client";
import { DepartmentRepository } from "@/lib/repositories/remote/DepartmentRepo";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useLoadDepartments() {
  const client = useQueryClient()


  const useRequest = () => useQuery({
    queryKey: ["departments"],
    queryFn: () => new DepartmentRepository().getAll().then(res => {
      if(!res.success) throw Error(res.message)

        return res.data
    })
  })

  const invalidate = () => client.invalidateQueries({queryKey: ["departments"]})

 

  return {query: useRequest, invalidate};
}
