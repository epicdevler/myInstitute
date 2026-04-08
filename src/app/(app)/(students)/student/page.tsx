"use client";
import { UserContext } from "@/app/context/UserContext";
import {
  Box,
  Button,
  GridItem,
  Heading,
  HStack,
  Separator,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { CourseItem } from "./CourseItem";
import { EmptyCourseState } from "./EmptyCourseState";
import { useLoadCourses } from "../../../hooks/useLoadCourses";
import { ErrorState } from "@/app/components/ErrorState";
import { LevelFilter } from "../../../components/LevelFilter";
import { useLevelFilter } from "../../../hooks/useLevelFilter";
import useGroupCourse from "@/app/hooks/useGroupCourse";

export default function StudentHomePage() {
  const { user } = use(UserContext);

  const { isLoading, courses, error } = useLoadCourses({
    enabled: true,
    courseId: user?.registeredCourses ?? [],
  });
  const { filteredCourses, level, onSelect } = useLevelFilter(courses);
  const groupedCourses = useGroupCourse(filteredCourses);

  return (
    <>
      <Heading mt={10} size="3xl">
        Welcome back, {user?.lastName}
      </Heading>
      <Text mt={2} mb={2}>
        Petroleom Training Institute, {user?.departmentId}
      </Text>

      <HStack justify={"space-between"} my={4} py={2}>
        <Text fontWeight={"semibold"}>Your Registered Courses</Text>
        <Button
          hidden={courses.length < 1}
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

      {/* <EmptyCourseState /> */}
    </>
  );
}
