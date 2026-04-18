"use client";
import { ErrorState } from "@/app/components/ErrorState";
import { UserContext } from "@/app/context/UserContext";
import { useLoadStudents } from "@/app/hooks/useLoadStudents";
import {
  Box,
  Button,
  Heading,
  HStack,
  SegmentGroup,
  VStack
} from "@chakra-ui/react";
import { UserPlus2 } from "lucide-react";
import { use, useState } from "react";
import EmptyState from "../../../../../components/EmptyState";
import MembersLoadingIndicator from "./components/members-loading-indicator";
import AddStaffDialog from "./dialog/create-staff-dialog";
import { StaffItem } from "./staff-item";

export default function StaffTab({ departmentId }: { departmentId?: string }) {
  const user = use(UserContext).user;
  const userId = user?.id;

  
  const isStaff = user?.role?.trim() === "staff";
  const isAdmin = user?.role?.trim() === "admin";

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

  const [filterByRole, setFilterByRole] = useState<string>("staff");


  const filteredMembers = staffs?.filter(pred => pred.role == filterByRole)

  return (
    <>
      <Box>
        <HStack justifyContent={"space-between"} py={5}>
          <Heading>Members</Heading>

         <HStack gap={4}>
           <SegmentGroup.Root
            rounded={"md"}
            size="sm"
            hidden={!isAdmin}
            mdDown={{ flex: 1, w: "fit" }}
            value={filterByRole}
            disabled={isLoading}
            onValueChange={({ value }) => !!value && setFilterByRole(value)}
          >
            <SegmentGroup.Indicator rounded={"md"} />
            <SegmentGroup.Item value="staff">
              <SegmentGroup.ItemHiddenInput />
              <SegmentGroup.ItemText>Staff</SegmentGroup.ItemText>
            </SegmentGroup.Item>
            <SegmentGroup.Item value="admin">
              <SegmentGroup.ItemHiddenInput />
              <SegmentGroup.ItemText>Admin</SegmentGroup.ItemText>
            </SegmentGroup.Item>
          </SegmentGroup.Root>
          <Button
            onClick={() => toggleOpenAddDialog()}
            variant={"outline"}
            rounded="full"
            hidden={!isAdmin}
          >
            <UserPlus2 /> Add
          </Button>
         </HStack>
        </HStack>
      </Box>

      {isLoading && <MembersLoadingIndicator />}

      {!isLoading && loadingError && (
        <ErrorState
          title="Failed to load courses"
          message={loadingError.message}
        />
      )}

      {!isLoading && !loadingError && (
        <>
          {!filteredMembers || filteredMembers?.length < 1 ? (
            <EmptyState
              title={"No Course found"}
              message={"Add courses to see them here..."}
            />
          ) : (
            <VStack align="stretch" cursor={"pointer"}>
              {filteredMembers.map((user, index) => {
                return (
                  <StaffItem
                    sn={index + 1}
                    key={user.id}
                    staff={user}
                    isSelf={userId == user.id}
                    isAdmin={isAdmin}
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
