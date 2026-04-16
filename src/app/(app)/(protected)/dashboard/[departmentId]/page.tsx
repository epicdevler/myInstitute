"use client";
import { ErrorState } from "@/app/components/ErrorState";
import { useLoadDepartment } from "@/app/hooks/useLoadDepartment";
import { Center, Heading, HStack, IconButton, Spinner, Tabs, Text } from "@chakra-ui/react";
import { ChevronLeftIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { LuNotebookPen, LuUser } from "react-icons/lu";
import CoursesTab from "../tabs/coures/CoursesTab";
import StudentsTab from "../tabs/students/StudentsTab";
import Link from "next/link";

export default function DepartmentDetail() {
  const departmentId = usePathname().split("/").pop();

  const { isLoading, loadingError, department, /* retry */ } = useLoadDepartment(
    departmentId!
  );

  return (
    <>
    {
        isLoading && <Center p={4}><Spinner /></Center>
    }

      {!isLoading && loadingError && (
        <ErrorState title="Failed to load courses" message={loadingError} />
      )}

    {
        !isLoading && !loadingError && (
            <>
      <Text mt={10} color="fg.muted">
        Department
      </Text>
      <HStack mt={5} gap={4}>
        <IconButton asChild size="sm" variant="outline" rounded={"full"}>
          <Link href="/dashboard"><ChevronLeftIcon /></Link>
        </IconButton>
        <Heading size="3xl">
          {department?.name} ({department?.code})
        </Heading>
      </HStack>

      <Tabs.Root
        lazyMount
        w="full"
        variant={"outline"}
        my={20}
        defaultValue="courses"
      >
        <Tabs.List>
          <Tabs.Trigger value="courses">
            <LuNotebookPen />
            Courses
          </Tabs.Trigger>
          <Tabs.Trigger value="students">
            <LuUser />
            Students
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="courses">
          <CoursesTab departmentId={departmentId} />
        </Tabs.Content>
        <Tabs.Content value="students">
          <StudentsTab departmentId={departmentId} />{" "}
        </Tabs.Content>
      </Tabs.Root>
    </>
        )
    }
    </>
  );
}
