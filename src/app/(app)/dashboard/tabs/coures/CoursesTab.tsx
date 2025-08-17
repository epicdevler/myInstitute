"use client";
import { CourseItem } from "@/app/(app)/(students)/student/CourseItem";
import { ErrorState } from "@/app/components/ErrorState";
import { Course } from "@/lib/models/Course";
import { PouchCourseRepository } from "@/lib/repositories/PouchCourseRepo";
import {
  Box,
  Button,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import EmptyState from "../../EmptyState";
import CourseDialog from "./dialog/Dialog";

function useLoadCourses() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const invoke = async () => {
      setLoadingError(undefined);

      const response = await new PouchCourseRepository().getAll();

      if (!response.success) {
        setLoadingError(response.message);
        setIsLoading(false);
        return;
      }

      setCourses(response.data!);
      setIsLoading(false);
    };

    invoke();
  }, [retry]);

  return {
    isLoading,
    loadingError,
    courses,
    retry: () => {
      setRetry((prev) => prev + 1);
    },
  };
}

export default function CoursesTab() {
  const { isLoading, loadingError, courses, retry } = useLoadCourses();
  const [selected, setSelected] = useState<string>();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const toggleOpenAddDialog = useCallback(
    (success?: boolean) => {
      // retry()
      // return
      setOpenAddDialog((prev) => !prev);
      if (success == true) {
        retry();
      }
    },
    [retry]
  );
  return (
    <>
      <HStack justifyContent={"space-between"} py={5}>
        <Heading>Courses</Heading>
        <Button
          onClick={() => toggleOpenAddDialog()}
          variant={"outline"}
          rounded="full"
        >
          <PlusIcon /> Add More
        </Button>
      </HStack>

      {isLoading && (
        <Box p={5}>
          <Spinner />
        </Box>
      )}

      {!isLoading && loadingError && (
        <ErrorState title="Failed to load courses" message={loadingError} />
      )}

      {!isLoading && !loadingError && (
        <>
          {courses.length < 1 && (
            <EmptyState
              title={"No Course found"}
              message={"Add courses to see them here..."}
            />
          )}

          {courses.length > 0 && (
            <SimpleGrid columns={[2, null, 3]} gap={[2, null, 4]} mt={5}>
              {courses.map((course) => {
                return (
                  <GridItem key={course.id} colSpan={2} bg="red" asChild>
                    <CourseItem
                      admin
                      onClick={() => {
                        if (selected == course.id) {
                          setSelected(undefined);
                          return;
                        }
                        setSelected(course.id);
                      }}
                      course={course}
                      onSuccess={() => retry()}
                    />
                  </GridItem>
                );
              })}
            </SimpleGrid>
          )}
        </>
      )}

      <CourseDialog open={openAddDialog} onClose={toggleOpenAddDialog} />
    </>
  );
}
