"use client";
import { ErrorState } from "@/app/components/ErrorState";
import { LevelFilter } from "@/app/components/LevelFilter";
import { UserContext } from "@/app/context/UserContext";
import useGroupCourse from "@/app/hooks/useGroupCourse";
import { useLevelFilter } from "@/app/hooks/useLevelFilter";
import { useLoadCourses } from "@/app/hooks/useLoadCourses";
import {
  Box,
  Button,
  GridItem,
  Heading,
  HStack,
  Link,
  Separator,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";
import { use } from "react";
import { CourseItem } from "../CourseItem";
import { EmptyCourseState } from "../EmptyCourseState";

export default function StudentCourses() {
  const { user } = use(UserContext);

  const {
    isLoading,
    data: courses,
    error,
  } = useLoadCourses().query({
    enabled: true,
    courseId: user?.registeredCourses ?? [],
  });
  const { filteredCourses, level, onSelect } = useLevelFilter(courses);
  const groupedCourses = useGroupCourse(filteredCourses);

  return (
    <>
      <HStack justify={"space-between"} my={4} py={2}>
        <Text fontWeight={"semibold"}>Your Registered Courses</Text>
        <Button
          hidden={!courses || courses.length < 1}
          asChild
          variant={"outline"}
          rounded="full"
        >
          <Link href="/register-course">
            <PlusIcon /> Edit or Add
          </Link>
        </Button>
      </HStack>

      <LevelFilter onSelect={onSelect} value={level} />

      {isLoading && (
        <Box p={6}>
          <Spinner />
        </Box>
      )}

      {!isLoading && error && (
        <ErrorState title="Failed to load courses" message={error.message} />
      )}

      {!isLoading && !error && (
        <>
          {filteredCourses.length > 0 && (
            <Box>
              <Separator my={4} />
              {Array.from(groupedCourses.keys()).map((semester) => (
                <Box key={semester} mb={8}>
                  <Heading size="md" mb={4} textTransform={"capitalize"}>
                    {semester} Semester
                  </Heading>
                  <SimpleGrid columns={[2, 3, 4]} gap={4} mb={20}>
                    {groupedCourses.get(semester)?.map((course) => {
                      return (
                        <GridItem key={course.id} asChild>
                          <CourseItem course={course} />
                        </GridItem>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              ))}
            </Box>
          )}

          {filteredCourses.length < 1 && <EmptyCourseState />}
        </>
      )}
    </>
  );
}
