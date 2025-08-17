"use client";
import { ErrorState } from "@/app/components/ErrorState";
import { toaster } from "@/app/components/ui/toaster";
import { Department } from "@/lib/models/Department";
import { PouchDepartmentRepository } from "@/lib/repositories/PouchDepartmentRepo";
import {
  Box,
  Button,
  Center,
  Circle,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuItem,
  Portal,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { useLoadDepartments } from "./useLoadDepartments";
import EmptyState from "../../EmptyState";
import DepartmentDialog from "./dialog/Dialog";

export default function DepartmentsTab() {
  const { isLoading, loadingError, departments, retry } = useLoadDepartments();

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const toggleOpenAddDialog = useCallback(
    (success?: boolean) => {
      setOpenAddDialog((prev) => !prev);
      if (success == true) retry();
    },
    [retry]
  );

  return (
    <>
      <HStack justifyContent={"space-between"} py={5}>
        <Heading>All Departments</Heading>
        <Button
          onClick={() => toggleOpenAddDialog()}
          variant={"outline"}
          rounded="full"
        >
          <PlusIcon /> Add
        </Button>
      </HStack>

      {isLoading && (
        <Box p={5}>
          <Spinner />
        </Box>
      )}

      {!isLoading && loadingError && (
        <ErrorState title="Failed to load departments" message={loadingError} />
      )}

      {!isLoading && !loadingError && (
        <>
          {departments.length < 1 && (
            <EmptyState
              title={"No Departments found"}
              message={"Add departments to see them here..."}
            />
          )}

          {departments.length > 0 && (
            <VStack align="stretch" pt={8} cursor={"pointer"}>
              {departments.map((department, index) => {
                return (
                  <DepartmentItem
                    key={department.id}
                    sn={index + 1}
                    department={department}
                    onSuccess={() => retry()}
                  />
                );
              })}
            </VStack>
          )}
        </>
      )}

      <DepartmentDialog open={openAddDialog} onClose={toggleOpenAddDialog} />
    </>
  );
}

function DepartmentItem({
  sn,
  department,
  onSuccess,
}: {
  sn: number;
  department: Department;
  onSuccess: () => void;
}) {
  const [, /* isDeleting */ startDeleting] = useTransition();

  const onDelete = () => {
    startDeleting(async () => {
      const response = await new PouchDepartmentRepository().delete(
        department.id
      );

      if (response.success) {
        onSuccess();
        toaster.success({ description: department.code + " deleted." });
      } else {
        toaster.error({
          title: "Failed to delete" + department.code,
          description: response.message,
        });
      }
    });
  };

  return (
    <HStack p={3} rounded="xl" gap={4} _hover={{ bg: "bg.subtle" }}>
      <Center boxSize={"10"} rounded="full" borderWidth={"thin"}>
        {sn}
      </Center>
      <Box flex={1}>
        <Text fontSize="lg">{department.name}</Text>
        <HStack
          hidden
          align={["start", null, "center"]}
          gap={[0, null, 4]}
          flexDir={["column", null, "row"]}
          color="fg.muted"
        >
          <Text fontSize="sm">10 Students</Text>
          <Circle hideBelow={"md"} size={1} bg="bg.inverted" />
          <Text fontSize="sm">90 Cources</Text>
        </HStack>
      </Box>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton variant="ghost" rounded="full">
            <MoreVerticalIcon />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <MenuItem hidden cursor="pointer" value="edit">
                Edit
              </MenuItem>
              <MenuItem onClick={onDelete} cursor="pointer" value="delete">
                Delete
              </MenuItem>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </HStack>
  );
}
