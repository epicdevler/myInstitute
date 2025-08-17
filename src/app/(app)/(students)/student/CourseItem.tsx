import { toaster } from "@/app/components/ui/toaster";
import { Course } from "@/lib/models/Course";
import { PouchCourseRepository } from "@/lib/repositories/PouchCourseRepo";
import {
  Badge,
  Button,
  Card,
  Float,
  HStack,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Portal,
  Text,
} from "@chakra-ui/react";
import { MoreVerticalIcon } from "lucide-react";
import { useTransition } from "react";

export function CourseItem({
  course,
  admin,
  onMenuSelected,
  onClick,
  onSuccess,
}: {
  course: Course;
  admin?: boolean;
  onMenuSelected?: (selected: string) => void;
  onClick?: () => void;
  onSuccess?: () => void;
}) {
  const [, /* isDeleting */ startDeleting] = useTransition();

  const onDelete = () => {
    startDeleting(async () => {
      const response = await new PouchCourseRepository().delete(course.id);

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        }
        toaster.success({ description: course.code + " deleted." });
      } else {
        toaster.error({
          title: "Failed to delete" + course.code,
          description: response.message,
        });
      }
    });
  };
  
  return (
    <Card.Root
      pos="relative"
      onClick={onClick}
      _hover={{ bg: "bg.subtle" }}
      rounded={"xl"}
      size="sm"
      colorPalette={"orange"}
    >
      <Card.Header>
        <Card.Title>{course.code}</Card.Title>
      </Card.Header>
      <Card.Body>
        {/* <Card.Root size="sm" cursor={"pointer"}> */}
        {/* <Card.Body> */}
        <Text mt={1} fontSize={"sm"} lineClamp={3}>
          {course.title}
        </Text>
        <Text mt={2} fontSize={"sm"}>
          Unit: {course.creditUnit}
        </Text>

        <HStack flexWrap={"wrap"} mt={2}>
          {course.departmentId.map((code) => {
            return (
              <Badge
                rounded="full"
                colorPalette={"gray"}
                variant={"outline"}
                key={code}
              >
                {code}
              </Badge>
            );
          })}
        </HStack>

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
              mt={4}
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
                    Brief About
                  </Popover.Title>
                </Popover.Header>
                <Popover.Body>
                  <Popover.Description>
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
          <Menu.Root
            onSelect={
              onMenuSelected && ((detail) => onMenuSelected(detail.value))
            }
          >
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
                  <MenuItem onClick={onDelete} cursor="pointer" value="delete">
                    Delete
                  </MenuItem>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Float>
      )}
    </Card.Root>
  );
}
