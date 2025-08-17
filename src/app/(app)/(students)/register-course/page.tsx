"use client";
import { toaster } from "@/app/components/ui/toaster";
import { UserContext } from "@/app/context/UserContext";
import { useLoadCourses } from "@/app/hooks/useLoadCourses";
import { PouchUserRepository } from "@/lib/repositories/PouchUserRepo";
import {
  Alert,
  Badge,
  Box,
  Button,
  CheckboxCard,
  CheckboxGroup,
  EmptyState,
  GridItem,
  Heading,
  HStack,
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

export default function StudentRegisterCourse() {
  const router = useRouter();
  const { isLoading, courses, error } = useLoadCourses({ enabled: true });
  const { user, setLoggingOut } = use(UserContext);

  const [regCourseErr, setRegCourseErr] = useState<string>();
  const [isRegingCourse, startCourseReg] = useTransition();

  const [selectedCourse, setSelectedCourse] = useState<string[]>(
    user?.registeredCourses || []
  );

  const regCourse = () => {
    startCourseReg(async () => {
      const response = await new PouchUserRepository().registerCourses(
        user!.id,
        selectedCourse
      );

      if (!response.success) {
        setRegCourseErr(response.message);
        return;
      }

      setLoggingOut(true);
      if (user!.registeredCourses.length > 0) {
        toaster.success({
          title: `${selectedCourse.length} Courses Updated`,
          description: "Redirecting to home page",
        });
      }
      toaster.success({
        title: `${selectedCourse.length} Successfully Registered`,
        description: "Redirecting to home page",
      });
      router.replace("/", { scroll: true });
    });
  };

  return (
    <>
      <Button asChild mt={4} rounded="full" variant={"plain"} px="0">
        <Link href="/student" replace>
          <ArrowLeft /> Back home
        </Link>
      </Button>
      <Heading mt={10} size="3xl">
        Register Courses
      </Heading>
      <Text mt={2} mb={2} maxW={"md"} fontSize={"md"}>
        Browse the list below and pick the courses that excite you. You can
        choose as many as you like it’s your semester, your way!
      </Text>

      {isLoading && (
        <Box p={6}>
          <Spinner />
        </Box>
      )}

      {!isLoading && !error && (
        <>
          {courses.length > 0 && (
            <CheckboxGroup
              value={selectedCourse}
              onValueChange={(detail) => setSelectedCourse(detail)}
            >
              <SimpleGrid columns={[1, null, 3]} gap={4} mt={10}>
                {courses.map((course) => {
                  return (
                    <GridItem key={course.id} asChild>
                      <CheckboxCard.Root
                        cursor={"pointer"}
                        _hover={{ bg: "bg.subtle" }}
                        rounded={"xl"}
                        colorPalette={"orange"}
                        value={course.id}
                      >
                        <CheckboxCard.HiddenInput />
                        <CheckboxCard.Control>
                          <CheckboxCard.Content>
                            {/* <Card.Root size="sm" cursor={"pointer"}> */}
                            {/* <Card.Body> */}
                            <CheckboxCard.Label fontSize={"lg"}>
                              {course.code}
                            </CheckboxCard.Label>
                            <Text mt={1}>{course.title}</Text>
                            <Text mt={2} fontSize={"sm"}>
                              Unit: {course.creditUnit}
                            </Text>
                            <HStack flexWrap={"wrap"} mt={2}>
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
                            <CheckboxCard.Description mt="2">
                              {course.description}
                            </CheckboxCard.Description>
                            {/* </Card.Body> */}
                            {/* </Card.Root> */}
                          </CheckboxCard.Content>
                          <CheckboxCard.Indicator rounded={"full"} />
                        </CheckboxCard.Control>
                      </CheckboxCard.Root>
                    </GridItem>
                  );
                })}
              </SimpleGrid>
            </CheckboxGroup>
          )}

          {courses.length < 1 && <EmptyCourseState />}
        </>
      )}

      {regCourseErr && (
        <Alert.Root maxW={"md"} status={"error"} mt={10} mb={2}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Submit Failed</Alert.Title>
            <Alert.Description>{regCourseErr}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      <HStack
        mb={10}
        mt={!regCourseErr ? 10 : 1}
        hidden={courses.length < 1}
        justifyContent={"space-between"}
      >
        <Text fontSize={"lg"}>
          <Span color="fg.muted">{selectedCourse.length}</Span>/{courses.length}{" "}
          Selected
        </Text>
        <Button
          onClick={regCourse}
          disabled={selectedCourse.length < 1}
          loading={isRegingCourse}
          loadingText="Registering"
          colorPalette={"orange"}
          rounded="full"
          px="8"
          py={6}
        >
          Register Selected
        </Button>
      </HStack>
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
