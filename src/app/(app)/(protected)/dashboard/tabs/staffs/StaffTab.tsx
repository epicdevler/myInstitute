"use client";
import { ErrorState } from "@/app/components/ErrorState";
import { useLoadStudents } from "@/app/hooks/useLoadStudents";
import {
  Box,
  Button,
  Heading,
  HStack,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { UserPlus2 } from "lucide-react";
import { use, useState } from "react";
import EmptyState from "../../../../../components/EmptyState";
import AddStaffDialog from "./dialog/create-staff-dialog";
import { StaffItem } from "./staff-item";
import { UserContext } from "@/app/context/UserContext";
import MembersLoadingIndicator from "./components/members-loading-indicator";

export default function StaffTab({ departmentId }: { departmentId?: string }) {
  const user = use(UserContext).user;

  const isStaff = user?.role == "staff";

  const departId = departmentId ?? (isStaff ? user?.departmentId : undefined);

  const {
    isLoading,
    error: loadingError,
    data: staffs,
  } = useLoadStudents().query({
    role: isStaff ? ["staff"] : ["staff", "admin"],
    departmentId: departId ? [departId] : undefined,
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const toggleOpenAddDialog = () => setOpenAddDialog((prev) => !prev);
  return (
    <>
      <Box>
        <HStack justifyContent={"space-between"} py={5}>
          <Heading>Members</Heading>
          <Button
            onClick={() => toggleOpenAddDialog()}
            variant={"outline"}
            rounded="full"
          >
            <UserPlus2 /> Add
          </Button>
        </HStack>
      </Box>

      {isLoading && (<MembersLoadingIndicator />
      )}

      {!isLoading && loadingError && (
        <ErrorState
          title="Failed to load courses"
          message={loadingError.message}
        />
      )}

      {!isLoading && !loadingError && (
        <>
          {!staffs || staffs?.length < 1 ? (
            <EmptyState
              title={"No Course found"}
              message={"Add courses to see them here..."}
            />
          ) : (
            <VStack align="stretch" cursor={"pointer"}>
              {staffs.map((user, index) => {
                return (
                  <StaffItem
                    sn={index + 1}
                    key={user.id}
                    staff={user}
                    isSelf={user?.id == user.id}
                    onSelect={() => {
                      /* handleUserSelect(student.id) */
                    }}
                  />
                );
              })}
            </VStack>
          )}
        </>
      )}

      {
        /* openAddDialog && */ <AddStaffDialog
          open={openAddDialog}
          onClose={toggleOpenAddDialog}
        />
      }
    </>
  );
}
