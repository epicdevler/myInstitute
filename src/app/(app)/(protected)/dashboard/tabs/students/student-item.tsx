import { toaster } from "@/app/components/ui/toaster";
import { User } from "@/lib/models/User";
import {
  Badge,
  Box,
  Center,
  Circle,
  HStack,
  IconButton,
  Menu,
  MenuItem,
  MenuItemText,
  MenuSelectionDetails,
  MenuSeparator,
  Portal,
  Presence,
  Spinner,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { MoreVerticalIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import useUpdateStatus from "./hooks/mutations/use-update-student-status";

const ConfirmUserDelete = dynamic(
  () => import("../staffs/dialog/delete-staff-dialog"),
  { ssr: false },
);

export function StudentItem({
  sn,
  student,
  filteringStatus,
  onSelect,
  isAdmin,
}: {
  sn: number;
  student: User;
  filteringStatus: string;
  onSelect: () => void;
  isAdmin: boolean;
}) {
  const displayName = `${student.firstName} ${student.lastName}`;
  const [openMenu, setOpenMenu] = useState(false);
  const [confirmUserDelete, setDeleteUser] = useState(false);

  const { mutate: approveStudent, isPending: isApprovingStudent } =
    useUpdateStatus().approve();

  const { mutate: declineStudent, isPending: isDecliningStudent } =
    useUpdateStatus().decline();

  const handleMenuSelect = ({ value }: MenuSelectionDetails) => {
    switch (value) {
      case "view":
        onSelect();
        break;
      case "approve":
        approveStudent(student.id, {
          onSuccess: () => {
            setOpenMenu(false);
            toaster.success({ description: `${displayName} Approved` });
          },
          onError: (e) => toaster.error({ description: e.message }),
        });
        break;
      case "decline":
        declineStudent(student.id, {
          onSuccess: () => {
            setOpenMenu(false);
            toaster.success({ description: `${displayName} Declined` });
          },
          onError: (e) => toaster.error({ description: e.message }),
        });
        break;
      case "delete":
        setDeleteUser(true);
        setOpenMenu(false);
        break;

      default:
        break;
    }
  };

  const canApprove = !student.student || student.student?.status != "approved";
  const canDecline = !student.student || student.student?.status == "pending";

  return (
    <>
      <HStack
        // onClick={onSelect}
        p={3}
        rounded="xl"
        gap={4}
        _hover={{ bg: "bg.subtle" }}
      >
        <Center boxSize={"10"} rounded="full" borderWidth={"thin"}>
          {sn}
        </Center>
        <Box flex={1}>
          <HStack>
            <Text fontSize="lg" textTransform={"capitalize"}>
              {student.firstName} {student.lastName}
            </Text>
            <Circle size={1} bg="fg.subtle" />
            <Badge fontSize="sm" textTransform={"uppercase"}>
              {student.departmentId}
            </Badge>
          </HStack>

          <Presence
            present={filteringStatus == "approved"}
            animationName={{
              _open: "slide-from-bottom",
              _closed: "slide-to-bottom",
            }}
          >
            <Wrap
              align={["center"]}
              gap={[2]}
              // flexDir={["column", null, "row"]}
              color="fg.muted"
            >
              <Text fontSize="sm">
                {student?.registeredCourses?.length} Registered
              </Text>
              <Circle size={1} bg="fg.subtle" />
              <Text fontSize="sm">
                {student.spilledCourses?.length ?? 0} Spill
              </Text>
              <Circle size={1} bg="fg.subtle" />
              <Text fontSize="sm">
                {student.carryOverCourses?.length ?? 0} CO
              </Text>
            </Wrap>
          </Presence>

          <Presence
            present={filteringStatus == "pending"}
            animationName={{
              _open: "slide-from-bottom",
              _closed: "slide-to-bottom",
            }}
          >
            <Wrap
              align={["center"]}
              gap={[2]}
              // flexDir={["column", null, "row"]}
              color="fg.muted"
            >
              <Text fontSize="sm">
                Registered on {student?.createAt?.toDateString()}
              </Text>
            </Wrap>
          </Presence>
        </Box>
        <Menu.Root
          open={openMenu}
          onOpenChange={({ open }) => setOpenMenu(open)}
          closeOnSelect={false}
          onSelect={handleMenuSelect}
        >
          <Menu.Trigger asChild>
            <IconButton variant="ghost" size="sm" rounded="full">
              <MoreVerticalIcon />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <MenuItem cursor="pointer" value="view">
                  <MenuItemText>View</MenuItemText>
                </MenuItem>
                <MenuSeparator />
                <MenuItem
                  hidden={!canApprove}
                  cursor="pointer"
                  value="approve"
                  color="fg.success"
                  _hover={{ bg: "bg.success", color: "fg.success" }}
                >
                  <MenuItemText>Approve</MenuItemText>{" "}
                  {isApprovingStudent && <Spinner size={"sm"} />}
                </MenuItem>
                <MenuItem
                  hidden={!canDecline}
                  cursor="pointer"
                  value="decline"
                  color="fg.warning"
                  _hover={{ bg: "bg.warning", color: "fg.warning" }}
                >
                  <MenuItemText>Decline</MenuItemText>{" "}
                  {isDecliningStudent && <Spinner size={"sm"} />}
                </MenuItem>
                <MenuItem
                  hidden={!isAdmin}
                  cursor="pointer"
                  value="delete"
                  color="fg.error"
                  _hover={{ bg: "bg.error", color: "fg.error" }}
                >
                  Delete
                </MenuItem>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      {
        /* confirmUserDelete && */ <ConfirmUserDelete
          open={confirmUserDelete}
          onClose={() => setDeleteUser(false)}
          data={{
            name: `${student.firstName} ${student.lastName}`,
            userId: student.id,
          }}
        />
      }
    </>
  );
}
