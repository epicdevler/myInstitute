"use client";
import { CourseItem } from "@/app/(app)/(protected)/(students)/student/CourseItem";
import { ErrorState } from "@/app/components/ErrorState";
import useGroupCourse from "@/app/hooks/useGroupCourse";
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
  Skeleton,
  SkeletonText,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";
import { use, useState } from "react";
import { LevelFilter } from "../../../../../components/LevelFilter";
import EmptyState from "../../../../../components/EmptyState";
import CourseDialog from "./dialog/Dialog";
import { UserContext } from "@/app/context/UserContext";
import CourseLoadingIndicator from "./components/course-loading-indicator";

export default function CoursesTab({
  departmentId,
}: {
  departmentId?: string;
}) {
  const user = use(UserContext).user;
  const {
    isLoading,
    error: loadingError,
    data: courses,
  } = useLoadCourses().query({
    enabled: true,
    departmentId:
      departmentId ?? (user?.role == "staff" ? user.departmentId : undefined),
  });
  const { filteredCourses, level, onSelect } = useLevelFilter(courses || []);
  const groupedCourses = useGroupCourse(filteredCourses);
  const [selected, setSelected] = useState<string>();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const toggleOpenAddDialog = () => setOpenAddDialog((prev) => !prev);

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

        <LevelFilter disabled={isLoading} value={level} onSelect={onSelect} />
      </Box>

      {isLoading && <CourseLoadingIndicator />}

      {!isLoading && loadingError && (
        <ErrorState
          title="Failed to load courses"
          message={loadingError.message}
        />
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
            <Box mt={6}>
              {/* <Separator my={4} /> */}
              {Array.from(groupedCourses.keys()).map((semester) => (
                <Box key={semester} mb={8}>
                  <Text
                    fontSize="sm"
                    color="fg.muted"
                    mb={4}
                    textTransform={"capitalize"}
                  >
                    {semester} Semester
                  </Text>
                  <SimpleGrid columns={[2, 3, 4]} gap={[4]} mt={5}>
                    {groupedCourses.get(semester)?.map((course) => {
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
