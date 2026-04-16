import { toaster } from "@/app/components/ui/toaster";
import { useLoadCourses } from "@/app/hooks/useLoadCourses";
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
import { Course } from "@/lib/models/Course";
import { CourseRepository } from "@/lib/repositories/remote/CourseRepo";
import {
  Badge,
  Button,
  Card,
  CardRootProps,
  Float,
  HStack,
  IconButton,
  Menu,
  MenuItem,
  MenuSelectionDetails,
  Popover,
  Portal,
  Presence,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { MoreVerticalIcon } from "lucide-react";
import { useState } from "react";

type CourseItemProps = Omit<CardRootProps, "children"> & {
  course: Course;
  admin?: boolean;
  onMenuSelected?: (selected: string) => void;
  onClick?: () => void;
};
export function CourseItem(props: CourseItemProps) {
  const { course, admin, onClick, ...rest } = props;

  const handleMenuSelect = ({ value }: MenuSelectionDetails) => {
    switch (value) {
      case "delete":
        setOpenDeleteDialog(true);
        break;

      default:
        break;
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const onDelete = () => {
    /* startDeleting(async () => {
      const response = await new CourseRepository().delete(course.id);

      if (response.success) {
        invalidate();
        toaster.success({ description: course.code + " deleted." });
      } else {
        toaster.error({
          title: "Failed to delete" + course.code,
          description: response.message,
        });
      }
    }); */
  };

  return (
    <>
      <Card.Root
        pos="relative"
        onClick={onClick}
        _hover={{ bg: "bg.subtle" }}
        rounded={"xl"}
        size="sm"
        colorPalette={"blue"}
        variant={"subtle"}
        w="full"
        justifyContent={"stretch"}
        {...rest}
      >
        <Card.Body h="full" flex="1">
          {/* <Card.Root size="sm" cursor={"pointer"}> */}
          {/* <Card.Body> */}
          <Card.Title textTransform={"uppercase"}>{course.code}</Card.Title>
          <Text
            textTransform={"capitalize"}
            fontSize={"sm"}
            color="fg.muted"
            lineClamp={3}
            title={course.title}
          >
            {course.title}
          </Text>

          {
            /* admin &&  */ <>
              <Text hidden mt={4} fontSize={"sm"} color="fg.muted">
                Departments
              </Text>
              <HStack flexWrap={"wrap"} py={2}>
                {course.departmentId.map((code) => {
                  return (
                    <Badge
                      rounded="full"
                      colorPalette={"gray"}
                      variant={"outline"}
                      textTransform={"uppercase"}
                      key={code}
                    >
                      {code}
                    </Badge>
                  );
                })}
              </HStack>
            </>
          }

          {/* </Card.Body> */}
          {/* </Card.Root> */}
        </Card.Body>
        <Card.Footer>
          <Popover.Root lazyMount unmountOnExit>
            <Popover.Trigger asChild>
              <Button
                w="fit"
                size="sm"
                colorPalette={"gray"}
                color="fg.muted"
                variant={"plain"}
                px="0"
              >
                See Detail
              </Button>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content>
                  <Popover.Arrow />
                  <Popover.Header>
                    <Popover.Title fontSize={"lg"} fontWeight={"semibold"}>
                      Course Details
                    </Popover.Title>
                  </Popover.Header>
                  <Popover.Body overflowY={"auto"}>
                    <Text fontSize={"sm"}>
                      Level {course.level.replace("-", " ")}
                    </Text>
                    <Text fontSize={"sm"} textTransform={"capitalize"}>
                      Semester {course.semester}
                    </Text>
                    <Text fontSize={"sm"}>Course Unit {course.creditUnit}</Text>

                    <Text mt={4} mb={1} fontSize={"sm"} color="fg.muted">
                      Description
                    </Text>
                    <Popover.Description fontSize={"sm"}>
                      {course.description}
                    </Popover.Description>
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        </Card.Footer>

        {admin && (
          <Float offset={5}>
            <Menu.Root onSelect={handleMenuSelect}>
              <Menu.Trigger asChild>
                <IconButton
                  colorPalette={"gray"}
                  size="xs"
                  variant="ghost"
                  rounded="full"
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
                    <MenuItem
                      onClick={onDelete}
                      cursor="pointer"
                      value="delete"
                      color="fg.error"
                      _hover={{ bg: "bg.error" }}
                    >
                      Delete
                    </MenuItem>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Float>
        )}
      </Card.Root>

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        course={{ title: course.code, id: course.id }}
      />
    </>
  );
}

function ConfirmDeleteDialog({
  course: { title, id },
  open,
  onClose,
}: {
  course: { title: string; id: string };
  open: boolean;
  onClose: () => void;
}) {
  const invalidate = useLoadCourses().invalidate;
  const {
    mutate,
    isPending: isDeleting,
    error,
  } = useMutation({
    mutationKey: ["course", "delete"],
    mutationFn: (courseId: string) =>
      new CourseRepository().delete(courseId).then((res) => {
        if (!res.success) throw Error(res.message);
        return res.data;
      }),
    onSuccess: () => {
      toaster.success({ description: title + " deleted." });
      onClose();
    },
    onSettled: invalidate,
  });

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
          <DialogTitle>Delete {title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>
            Are you sure? this operation can not be undone.
          </DialogDescription>

          <Presence present={!!error}>
            <Alert alignItems={"center"} size="sm" mt={4}>
              {error?.message}
            </Alert>
          </Presence>
        </DialogBody>
        <DialogFooter justifyContent={"end"}>
          <DialogActionTrigger asChild>
            <Button disabled={isDeleting} variant="outline">
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            onClick={() => mutate(id)}
            loading={isDeleting}
            colorPalette={"red"}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
