import { toaster } from "@/app/components/ui/toaster";
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
  Popover,
  Portal,
  Text,
} from "@chakra-ui/react";
import { MoreVerticalIcon } from "lucide-react";
import { useTransition } from "react";

type CourseItemProps = Omit<CardRootProps, "children"> & {
  course: Course;
  admin?: boolean;
  onMenuSelected?: (selected: string) => void;
  onClick?: () => void;
  onSuccess?: () => void;
};
export function CourseItem(props: CourseItemProps) {
  const { course, admin, onMenuSelected, onClick, onSuccess, ...rest } = props;
  const [, /* isDeleting */ startDeleting] = useTransition();

  const onDelete = () => {
    startDeleting(async () => {
      const response = await new CourseRepository().delete(course.id);

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
      variant={"subtle"}
      w="full"
      {...rest}
    >
      <Card.Body>
        {/* <Card.Root size="sm" cursor={"pointer"}> */}
        {/* <Card.Body> */}
        <Card.Title>{course.code}</Card.Title>
        <Text fontSize={"sm"} lineClamp={3}>
          {course.title}
        </Text>

        {
          /* admin &&  */(
            <>
            <Text mt={4} fontSize={"sm"} color="fg.muted">
                    Departments
                  </Text>
                  <HStack flexWrap={"wrap"} py={2}>
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
                  </>
          )
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
