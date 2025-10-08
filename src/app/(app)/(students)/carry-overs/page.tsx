"use client";
import { ErrorState } from "@/app/components/ErrorState";
import { UserContext } from "@/app/context/UserContext";
import useGroupCourse from "@/app/hooks/useGroupCourse";
import {
  Box,
  Button,
  GridItem,
  Heading,
  HStack,
  Separator,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { LevelFilter } from "../../../components/LevelFilter";
import { useLevelFilter } from "../../../hooks/useLevelFilter";
import { useLoadCourses } from "../../../hooks/useLoadCourses";
import { CourseItem } from "../student/CourseItem";
import { EmptyState } from "@/app/components/EmptyCourseState";

export default function CarryOverPage() {
  const { user } = use(UserContext);

  const { isLoading, courses, error } = useLoadCourses({
    enabled: true,
    courseId: user?.carryOverCourses ?? [],
  });
  const { filteredCourses, level, onSelect } = useLevelFilter(courses);
  const groupedCourses = useGroupCourse(filteredCourses);

  return (
    <>
      <HStack justify={"space-between"} mt={10} py={2}>
        <Heading fontWeight={"semibold"} size="3xl">
          Your Carry Over Courses
        </Heading>
        <Button
          hidden={courses.length < 1}
          asChild
          variant={"outline"}
          rounded="full"
        >
          <Link href="/register-course?type=carry-over">
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
        <ErrorState title="Failed to load courses" message={error} />
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
                  <SimpleGrid columns={[1, null, 3]} gap={[2, null, 4]} mb={20}>
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

          {filteredCourses.length < 1 && (
            <EmptyState
              title="No Carry Over Courses"
              actionRedirect="/register-course?type=carry-over"
              actionLabel="Register"
            />
          )}
        </>
      )}

      {/* <EmptyCourseState /> */}
    </>
  );
}
