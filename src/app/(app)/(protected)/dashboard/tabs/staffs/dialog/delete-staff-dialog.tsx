import { toaster } from "@/app/components/ui/toaster";
import { useLoadStudents } from "@/app/hooks/useLoadStudents";
import { Alert } from "@/components/ui/alert";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, Presence, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import deleteStaffAction from "./delete-staff-action";

export default function DeleteStaffConfirmDialog({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: { name: string; userId: string };
}) {
  const invalidate = useLoadStudents().invalidate;

  const {
    mutate,
    isPending: isDeleting,
    error,
  } = useMutation({
    mutationKey: ["staffs", "create"],
    mutationFn: (userId: string) =>
      deleteStaffAction(userId).then((res) => {
        if (!res.success) throw Error(res.message);
      }),
    onSuccess: () => {
      toaster.success({ description: "Staff Created." });
      onClose();
    },
    onSettled: invalidate,
  });

  return (
    <DialogRoot
      open={open}
      onOpenChange={({ open }) => !open && onClose()}
      closeOnEscape={!isDeleting}
      closeOnInteractOutside={!isDeleting}
      placement={"center"}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text>Are you sure you want to delete this user?</Text>
          <DialogDescription mt={1}>
            {data.name} will be logged out and permanently deleted.
          </DialogDescription>

          <Presence present={!!error}>
            <Alert status="error" size="sm" mt={5} alignItems={"center"}>
              {error?.message}
            </Alert>
          </Presence>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button disabled={isDeleting} variant={"outline"}>
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            loading={isDeleting}
            onClick={() => mutate(data.userId)}
            colorPalette={"red"}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
