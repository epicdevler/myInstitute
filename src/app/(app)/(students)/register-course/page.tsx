"use client";
import { toaster } from "@/app/components/ui/toaster";
import { UserContext } from "@/app/context/UserContext";
import { useLoadCourses } from "@/app/hooks/useLoadCourses";
import { UserRepository } from "@/lib/repositories/remote/UserRepo";
import {
  Alert,
  Box,
  Button,
  CheckboxCard,
  CheckboxGroup,
  EmptyState,
  GridItem,
  Heading,
  HStack,
  Separator,
  SimpleGrid,
  Span,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { use, useState, useTransition } from "react";
import EmptyStateIllustration from "../../../../../public/assets/empty_state.svg";
import { CourseItem } from "../student/CourseItem";
import { LevelFilter } from "../../../components/LevelFilter";
import { useLevelFilter } from "../../../hooks/useLevelFilter";
import useGroupCourse from "@/app/hooks/useGroupCourse";
import { useSearchParams } from "next/navigation";
import { ErrorState } from "@/app/components/ErrorState";

export default function StudentRegisterCourse() {
  const { user } = use(UserContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registerType = searchParams.get("type");
  const isSpillOver = registerType == "spill-over";
  const isCarryOver = registerType == "carry-over";
  const isNormal = registerType == undefined;

  const { isLoading, courses, error } = useLoadCourses({
    enabled: isSpillOver || isCarryOver || isNormal,
    departmentId: user?.departmentId,
  });
  const { filteredCourses, level, onSelect } = useLevelFilter(courses);
  const groupedCourses = useGroupCourse(filteredCourses);

  const [regCourseErr, setRegCourseErr] = useState<string>();
  const [isRegingCourse, startCourseReg] = useTransition();

  const [selectedCourse, setSelectedCourse] = useState<string[]>(
    (isCarryOver
      ? user?.carryOverCourses
      : isSpillOver
        ? user?.spilledCourses
        : user?.registeredCourses) || [],
  );

  const regCourse = () => {
    startCourseReg(async () => {
      const response = await new UserRepository().registerCourses(
        user!.id,
        selectedCourse,
        isSpillOver ? "SpilledOver" : isCarryOver ? "CarryOver" : "Normal",
      );

      if (!response.success) {
        setRegCourseErr(response.message);
        return;
      }

      toaster.success({
        title: `${selectedCourse.length} Courses Updated`,
        description: "Redirecting to home page",
      });

      router.replace(
        isCarryOver ? "/carry-over" : isSpillOver ? "/spill-over" : "/",
        { scroll: true },
      );
    });
  };

  return (
    <>
      <Button asChild mt={4} rounded="full" variant={"plain"} px="0">
        <Link href="/student" replace>
          <ArrowLeft /> Back home
        </Link>
      </Button>

      {/* INVALID REG TYPE */}

      {!isCarryOver && !isNormal && !isSpillOver && (
        <ErrorState title="Invalid Registration Type" message="" />
      )}

      {/* MAIN CONTENT */}
      {(isCarryOver || isNormal || isSpillOver) && (
        <>
          <Heading mt={10} size="3xl">
            Register{" "}
            {isCarryOver ? "Carry Over" : isSpillOver ? "Spill Over" : ""}{" "}
            Courses
          </Heading>
          <Text mt={2} mb={2} maxW={"md"} fontSize={"md"}>
            Browse the list below and pick the courses that excite you. You can
            choose as many as you like it’s your semester, your way!
          </Text>

          <Box mt="5" hidden={courses.length < 1}>
            <LevelFilter value={level} onSelect={onSelect} />
            <Separator my={4} />

            <HStack mb={10} mt={5} justifyContent={"space-between"}>
              <Text fontSize={"lg"}>
                <Span color="fg.muted">{selectedCourse.length}</Span>/
                {courses.length} Selected
              </Text>
              <Button
                onClick={regCourse}
                disabled={selectedCourse.length < 1}
                loading={isRegingCourse}
                loadingText="Registering"
                colorPalette={"blue"}
                rounded="full"
                px="8"
                py={3}
              >
                Register Selected
              </Button>
            </HStack>
          </Box>

          {regCourseErr && (
            <Alert.Root
              /* maxW={"md"} */ size="sm"
              status={"error"}
              mt={10}
              mb={2}
            >
              <Alert.Indicator />
              <Alert.Content>
                {/* <Alert.Title>Submit Failed</Alert.Title> */}
                <Alert.Description>{regCourseErr}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {isLoading && (
            <Box p={6}>
              <Spinner />
            </Box>
          )}

          {!isLoading && !error && (
            <>
              {filteredCourses.length > 0 && (
                <CheckboxGroup
                  value={selectedCourse}
                  onValueChange={(detail) => {
                    setSelectedCourse(detail);
                    setRegCourseErr(undefined);
                  }}
                >
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
                      <SimpleGrid columns={[2, 3, 4]} gap={4}>
                        {groupedCourses.get(semester)?.map((course) => {
                          return (
                            <GridItem key={course.id} asChild>
                              <CheckboxCard.Root
                                cursor={"pointer"}
                                _hover={{ bg: "bg.subtle" }}
                                rounded={"xl"}
                                colorPalette={"blue"}
                                value={course.id}
                              >
                                <CheckboxCard.HiddenInput />
                                <CheckboxCard.Control p="0" m="0" gap="0">
                                  <CheckboxCard.Content asChild m="0">
                                    {/* <Card.Root size="sm" cursor={"pointer"}> */}
                                    {/* <Card.Body> */}
                                    <CourseItem
                                      course={course}
                                      bg="transparent"
                                    />
                                    {/* </Card.Body> */}
                                    {/* </Card.Root> */}
                                  </CheckboxCard.Content>
                                  <CheckboxCard.Indicator
                                    cursor={"pointer"}
                                    rounded={"full"}
                                    m="1.5"
                                  />
                                </CheckboxCard.Control>
                              </CheckboxCard.Root>
                            </GridItem>
                          );
                        })}
                      </SimpleGrid>
                    </Box>
                  ))}
                </CheckboxGroup>
              )}

              {courses.length < 1 && <EmptyCourseState />}
            </>
          )}
        </>
      )}
    </>
  );
}

function EmptyCourseState() {
  return (
    <EmptyState.Root>
      <EmptyState.Content gap={2}>
        <EmptyState.Indicator>
          <Box asChild w="40">
            <Image src={EmptyStateIllustration} alt="Empty State" />
          </Box>
        </EmptyState.Indicator>
        <EmptyState.Title mt={10}>No Course Found</EmptyState.Title>
        <EmptyState.Description>
          Courses are not yet available, check in later
        </EmptyState.Description>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
