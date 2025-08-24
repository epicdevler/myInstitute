"use client";
import { CourseItem } from "@/app/(app)/(students)/student/CourseItem";
import { ErrorState } from "@/app/components/ErrorState";
import { useLevelFilter } from "@/app/hooks/useLevelFilter";
import { useLoadCourses } from "@/app/hooks/useLoadCourses";
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
import { useCallback, useState } from "react";
import EmptyState from "../../EmptyState";
import CourseDialog from "./dialog/Dialog";
import { LevelFilter } from "../../../../components/LevelFilter";
import useGroupCourse from "@/app/hooks/useGroupCourse";

export default function CoursesTab() {
  const {
    isLoading,
    error: loadingError,
    courses,
    onRetry,
  } = useLoadCourses({ enabled: true });
  const { filteredCourses, level, onSelect } = useLevelFilter(courses);
  const groupedCourses = useGroupCourse(filteredCourses);
  const [selected, setSelected] = useState<string>();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const toggleOpenAddDialog = useCallback(
    (success?: boolean) => {
      // retry()
      // return
      setOpenAddDialog((prev) => !prev);
      if (success == true) {
        onRetry();
      }
    },
    [onRetry]
  );
  return (
    <>
      <Box>
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

        <LevelFilter value={level} onSelect={onSelect} />
      </Box>

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
          {filteredCourses.length < 1 && (
            <EmptyState
              title={"No Course found"}
              message={"Add courses to see them here..."}
            />
          )}

          {filteredCourses.length > 0 && (
            <Box>
              <Separator my={4} />
              {Array.from(groupedCourses.keys()).map((semester) => (
                <Box key={semester} mb={8}>
                  <Heading size="md" mb={4} textTransform={"capitalize"}>
                    {semester} Semester
                  </Heading>
                  <SimpleGrid columns={[2, null, 3]} gap={[2, null, 4]} mt={5}>
                    {filteredCourses.map((course) => {
                      return (
                        <GridItem key={course.id} asChild>
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
                            onSuccess={() => onRetry()}
                          />
                        </GridItem>
                      );
                    })}
                  </SimpleGrid>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}

      {openAddDialog && (
        <CourseDialog open={openAddDialog} onClose={toggleOpenAddDialog} />
      )}
    </>
  );
}
