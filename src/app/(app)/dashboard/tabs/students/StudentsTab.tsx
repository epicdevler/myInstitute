"use client";
import { ErrorState } from "@/app/components/ErrorState";
import { User } from "@/lib/models/User";
import { StudentRepository } from "@/lib/repositories/remote/StudentsRepo";
import {
  Badge,
  Box,
  Button,
  Center,
  Circle,
  CloseButton,
  Container,
  Drawer,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuItem,
  Portal,
  Spinner,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { MoreVerticalIcon } from "lucide-react";
import React from "react";
import { useLoadStudents } from "../../../../hooks/useLoadStudents";

export default function StudentsTab({
  departmentId,
}: {
  departmentId?: string;
}) {
  const { isLoading, loadingError, students } = useLoadStudents(departmentId);

  const [selectedStudentID, setSelectedStudentID] = React.useState<
    string | null
  >();

  const handleUserSelect = (studentId?: string) => {
    setSelectedStudentID(studentId);
  };

  return (
    <>
      <Heading py={5}>Students</Heading>

      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}

      {!isLoading && loadingError && (
        <ErrorState  title={"Failed to load students"} message={loadingError} />
      )}

      {!isLoading && !loadingError && (
        <VStack align="stretch" cursor={"pointer"}>
          {students.map((student, index) => {
            return (
              <StudentItem
                sn={index + 1}
                key={student.id}
                student={student}
                onSelect={() => handleUserSelect(student.id)}
              />
            );
          })}
        </VStack>
      )}

      {selectedStudentID && (
        <StudentDetail
          studentId={selectedStudentID}
          onClose={handleUserSelect}
        />
      )}
    </>
  );
}

const StudentDetail = ({
  studentId,
  onClose,
}: {
  studentId: string;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadingError, setLoadingError] = React.useState<string | undefined>();
  const [students, setStudents] = React.useState<User | undefined>();

  React.useEffect(() => {
    setIsLoading(true);
    setLoadingError(undefined);

    StudentRepository.getStudentById(studentId).then((res) => {
      if (res.success && res.data) {
        setStudents(res.data);
      } else {
        setLoadingError(res.message || "Failed to load students");
      }
      setIsLoading(false);
    });
  }, [studentId]);

  return (
    <Drawer.Root
      open={studentId !== undefined}
      onOpenChange={(detail) => {
        if (!detail.open) onClose();
      }}
      placement={"bottom"}
      unmountOnExit
      lazyMount
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Body>
              <Container py={[8, null, 16]} maxW={"4xl"}>
                <Drawer.Title
                  borderBottomWidth={"thin"}
                  fontSize={"2xl"}
                  pb={2}
                  mb={10}
                >
                  Student Detail
                </Drawer.Title>
                {isLoading && (
                  <Center>
                    <Spinner />
                  </Center>
                )}

                {!isLoading && loadingError && (
                  <ErrorState
                    title={"Failed to load student"}
                    message={loadingError}
                  />
                )}

                {!isLoading && !loadingError && students && (
                  <VStack align="stretch" gap={6}>
                    <Box>
                      <Text fontSize="sm" color="fg.muted">
                        Full Name
                      </Text>
                      <HStack mt={1} justify="space-between">
                        <Heading size="md">
                          {students.firstName} {students.lastName}
                        </Heading>
                        <Button hidden>Edit</Button>
                      </HStack>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="fg.muted">
                        Email
                      </Text>
                      <Text fontSize="md">{students.email}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="fg.muted">
                        Department
                      </Text>
                      <Text mt={1} fontSize="md">
                        {students.departmentId}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="fg.muted">
                        Registered At
                      </Text>
                      <Text mt={1} fontSize="md">
                        {students.createAt.toDateString()}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="fg.muted">
                        Registered Courses
                      </Text>
                      <HStack mt={2} gap={2} flexWrap={"wrap"}>
                        {students.registeredCourses.map((course) => (
                          <Badge
                            key={course}
                            p={3}
                            rounded="lg"
                            borderWidth={"thin"}
                            textTransform={"uppercase"}
                          >
                            <Text>{course.replace("-", " ")}</Text>
                          </Badge>
                        ))}
                        {students.registeredCourses.length === 0 && (
                          <Text fontSize="sm" color="fg.muted">
                            No registered courses
                          </Text>
                        )}
                      </HStack>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="fg.muted">
                        Spill Over Courses
                      </Text>
                      <HStack mt={2} gap={2} flexWrap={"wrap"}>
                        {students?.spilledCourses?.map((course) => (
                          <Badge
                            key={course}
                            p={3}
                            rounded="lg"
                            borderWidth={"thin"}
                            textTransform={"uppercase"}
                          >
                            <Text>{course.replace("-", " ")}</Text>
                          </Badge>
                        ))}
                        {students?.spilledCourses?.length === 0 ||
                          (!students?.spilledCourses && (
                            <Text fontSize="sm" color="fg.muted">
                              No spill over courses
                            </Text>
                          ))}
                      </HStack>
                    </Box>

                    <Box>
                      <Text fontSize="sm" color="fg.muted">
                        Carry Over Courses
                      </Text>
                      <HStack mt={2} gap={2} flexWrap={"wrap"}>
                        {students?.carryOverCourses?.map((course) => (
                          <Badge
                            key={course}
                            p={3}
                            rounded="lg"
                            borderWidth={"thin"}
                            textTransform={"uppercase"}
                          >
                            <Text>{course.replace("-", " ")}</Text>
                          </Badge>
                        ))}
                        {students?.carryOverCourses?.length === 0 ||
                          (!students?.carryOverCourses && (
                            <Text fontSize="sm" color="fg.muted">
                              No carry over courses
                            </Text>
                          ))}
                      </HStack>
                    </Box>
                  </VStack>
                )}
              </Container>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};

export function StudentItem({
  sn,
  student,
  onSelect,
}: {
  sn: number;
  student: User;
  onSelect: () => void;
}) {
  return (
    <HStack
      onClick={onSelect}
      py={3}
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
            {student.firstName} {student.lastName}
          </Text>
          <Circle size={1} bg="fg.subtle" />
          <Badge fontSize="sm" textTransform={"uppercase"}>
            {student.departmentId}
          </Badge>
        </HStack>

        <Wrap
          align={["center"]}
          gap={[2]}
          // flexDir={["column", null, "row"]}
          color="fg.muted"
        >
          <Text fontSize="sm">
            {student.registeredCourses.length} Registered
          </Text>
          <Circle size={1} bg="fg.subtle" />
          <Text fontSize="sm">{student.spilledCourses?.length ?? 0} Spill</Text>
          <Circle size={1} bg="fg.subtle" />
          <Text fontSize="sm">{student.carryOverCourses?.length ?? 0} CO</Text>
        </Wrap>
      </Box>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton hidden variant="ghost" rounded="full">
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
  );
}
