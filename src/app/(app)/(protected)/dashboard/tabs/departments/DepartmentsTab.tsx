"use client";
import { ErrorState } from "@/app/components/ErrorState";
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
import { Department } from "@/lib/models/Department";
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
  MenuSelectionDetails,
  Portal,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import EmptyState from "../../../../../components/EmptyState";
import { useLoadDepartments } from "../../../../../hooks/useLoadDepartments";
import DepartmentDialog from "./dialog/Dialog";
import DepartmentLoadingIndicator from "./components/department-loading-indicator";

export default function DepartmentsTab() {
  const router = useRouter();
  
  const { isLoading, error, data: departments } = useLoadDepartments().query();

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const toggleOpenAddDialog = () => setOpenAddDialog((prev) => !prev)

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
        <DepartmentLoadingIndicator />
      )}

      {!isLoading && error && (
        <ErrorState title="Failed to load departments" message={error.message} />
      )}

      {!isLoading && !error && (
        <>
        {
          !departments || departments.length < 1 ? <EmptyState
              title={"No Departments found"}
              message={"Add departments to see them here..."}
            /> :<VStack align="stretch" pt={8}>
              {departments.map((department, index) => {
                return (
                  <DepartmentItem
                    key={department.id}
                    sn={index + 1}
                    department={department}
                    onClick={() => {
                      router.push(`/dashboard/${department.id}`);
                    }}                    
                  />
                );
              })}
            </VStack>
        }
          
        </>
      )}

      <DepartmentDialog open={openAddDialog} onClose={toggleOpenAddDialog} />
    </>
  );
}

function DepartmentItem({
  sn,
  department,
  onClick,  
}: {
  sn: number;
  department: Department;
  onClick: () => void;  
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleMenuSelect = (detail: MenuSelectionDetails) => {
    // return
    switch (detail.value) {
      case "delete":
        setConfirmDelete(true);
        break;
        
        break;

      default:
        break;
    }
  };

  return (
    <>
      <HStack p={3} rounded="xl" gap={4} _hover={{ bg: "bg.subtle" }}>
        <Center boxSize={"10"} rounded="full" borderWidth={"thin"}>
          {sn}
        </Center>
        <Box flex={1}>
          <Text
            onClick={onClick}
            cursor={"pointer"}
            fontSize="lg"
            textTransform={"capitalize"}
          >
            {department.name}
          </Text>
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
        <Menu.Root
          open={menuOpen}
          onOpenChange={({ open }) => setMenuOpen(open)}
          onSelect={handleMenuSelect}
        >
          <Menu.Trigger asChild>
            <IconButton
              onClick={() => {
                setMenuOpen(true);
              }}
              variant="ghost"
              rounded="full"
              size={"sm"}
            >
              <MoreVerticalIcon />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <MenuItem hidden cursor="pointer" value="edit">
                  Edit
                </MenuItem>
                <MenuItem cursor="pointer" value="delete">
                  Delete
                </MenuItem>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      {
        /* confirmDelete && */ <ConfirmDeleteDialog
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => {}}
        />
      }
    </>
  );
}

function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <DialogRoot
      open={open}
      onOpenChange={({ open }) => !open && onClose()}
      unmountOnExit
      lazyMount
      placement={"center"}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>Sure?</DialogDescription>
        </DialogBody>
        <DialogFooter justifyContent={"end"}>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button colorPalette={"red"}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
