import { User } from "@/lib/models/User";
import {
  Badge,
  Box,
  Center,
  HStack,
  IconButton,
  Menu,
  MenuItem,
  MenuValueChangeDetails,
  Portal,
  Span,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { MoreVerticalIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import UpdateStaffDialog from "./dialog/update-staff-dialog";

const ConfirmUserDelete = dynamic(
  () => import("./dialog/delete-staff-dialog"),
  { ssr: false },
);

export function StaffItem({
  sn,
  staff,
  onSelect,
  isSelf,
}: {
  sn: number;
  staff: User;
  isSelf: boolean;
  onSelect: () => void;
}) {
  const displayName = `${staff.staff?.title ?? staff.firstName} ${staff.lastName}`;

  const [confirmUserDelete, setDeleteUser] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const handleMenuSelect = (detail: MenuValueChangeDetails) => {
    switch (detail.value) {
      case "edit":
        setOpenUpdateDialog(true);
        break;
      case "delete":
        setDeleteUser(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <HStack
        onClick={onSelect}
        py={3}
        px={3}
        rounded="xl"
        gap={4}
        _hover={{ bg: "bg.subtle" }}
      >
        <Center boxSize={"10"} rounded="full" borderWidth={"thin"}>
          {sn}
        </Center>
        <Box flex={1}>
          <HStack>
            <Text fontSize="lg">
              {displayName} {isSelf && <Span color={"fg.muted"}>(You)</Span>}
            </Text>
          </HStack>

          <Wrap align={["center"]} gap={[2]} color="fg.muted">
            <Badge
              variant={"surface"}
              colorPalette={"blue"}
              size="sm"
              fontSize="sm"
              textTransform={"capitalize"}
            >
              {staff.role}
            </Badge>
            {staff.departmentId && (
              <Badge
                variant={"outline"}
                size="sm"
                fontSize="sm"
                textTransform={"uppercase"}
              >
                {staff.departmentId}
              </Badge>
            )}
          </Wrap>
        </Box>
        <Menu.Root onSelect={handleMenuSelect}>
          <Menu.Trigger asChild>
            <IconButton variant="ghost" rounded="full">
              <MoreVerticalIcon />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <MenuItem cursor="pointer" value="edit">
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
        /* confirmUserDelete && */ <ConfirmUserDelete
          open={confirmUserDelete}
          onClose={() => setDeleteUser(false)}
          data={{ name: displayName, userId: staff.id }}
        />
      }
      {
        /* confirmUserDelete && */ <UpdateStaffDialog
          open={openUpdateDialog}
          onClose={() => setOpenUpdateDialog(false)}
          user={staff}
        />
      }
    </>
  );
}
