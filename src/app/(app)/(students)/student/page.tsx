"use client";
import { UserContext } from "@/app/context/UserContext";
import {
  Box,
  Button,
  GridItem,
  Heading,
  HStack,
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

export default function StudentHomePage() {
  const { user } = use(UserContext);

  const { isLoading, courses, error } = useLoadCourses({
    enabled: true,
    courseId: user?.registeredCourses,
  });


  return (
    <>
      <Heading mt={10} size="3xl">
        Welcome back, {user?.lastName}
      </Heading>
      <Text mt={2} mb={2}>
        Petroleom Training Institute, {user?.departmentId}
      </Text>

      <HStack
        justify={"space-between"}
        my={10}
        py={4}
        borderBottomWidth={"thin"}
      >
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
          {courses.length > 0 && (
            <SimpleGrid columns={[1, null, 3]} gap={[2, null, 4]} mb={20}>
              {courses.map((course) => {
                return (
                  <GridItem key={course.id} asChild>
                    <CourseItem course={course} />
                  </GridItem>
                );
              })}
            </SimpleGrid>
          )}

          {courses.length < 1 && <EmptyCourseState />}
        </>
      )}

      {/* <EmptyCourseState /> */}
    </>
  );
}
