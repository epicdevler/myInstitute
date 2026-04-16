import { useLoadStudents } from "@/app/hooks/useLoadStudents";
import { StudentRepository } from "@/lib/repositories/remote/StudentsRepo";
import { useMutation } from "@tanstack/react-query";

export default function useUpdateStatus() {
  const { invalidate } = useLoadStudents();

  const useApprove = () =>
    useMutation({
      mutationKey: ["students", "update-status"],
      mutationFn: (userId: string) =>
        StudentRepository.updateStudentStatus(userId, "approved").then(
          (res) => {
            if (!res.success) throw Error(res.message);

            return res.data;
          },
        ),
      onSettled: invalidate,
    });

  const useDecline = () =>
    useMutation({
      mutationKey: ["students", "update-status"],
      mutationFn: (userId: string) =>
        StudentRepository.updateStudentStatus(userId, "declined").then(
          (res) => {
            if (!res.success) throw Error(res.message);

            return res.data;
          },
        ),
      onSettled: invalidate,
    });

  return { approve: useApprove, decline: useDecline };
}
