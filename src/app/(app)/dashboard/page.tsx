import {
  Card,
  FormatNumber,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { BookIcon, LayoutGridIcon, Users2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import CoursesTab from "./tabs/coures/CoursesTab";
import DepartmentsTab from "./tabs/departments/DepartmentsTab";
import StudentsTab from "./tabs/students/StudentsTab";

export default function Home() {
  return (
    <>
      <Heading mt={10} size="3xl">
        Hello, Admin
      </Heading>

      <SimpleGrid hidden columns={[1, 2, 3]} gap={4} mt={10}>
        <OverviewItem
          icon={<Users2Icon fontSize={"10"} />}
          label="Student"
          value={1230}
          href="/dashboard/students"
        />
        <OverviewItem
          icon={<LayoutGridIcon fontSize={"10"} />}
          label="Departments"
          value={1230}
          href="/dashboard/departments"
        />
        <OverviewItem
          icon={<BookIcon fontSize={"10"} />}
          label="Courses"
          value={1230}
          href="/dashboard/courses"
        />
        {/* <OverviewItem
          icon={<Users2Icon fontSize={"10"} />}
          label="Pending Approvals"
          value={1230}
          href="/dashboard/students"
        /> */}
      </SimpleGrid>

      <Tabs.Root
        lazyMount
        w="full"
        variant={"outline"}
        my={20}
        defaultValue="departments"
      >
        <Tabs.List>
          <Tabs.Trigger value="departments">
            <LuUser />
            Departments
          </Tabs.Trigger>
          <Tabs.Trigger value="courses">
            <LuFolder />
            Courses
          </Tabs.Trigger>
          <Tabs.Trigger value="students">
            <LuSquareCheck />
            Students
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="departments">
          <DepartmentsTab />
        </Tabs.Content>
        <Tabs.Content value="courses">
          <CoursesTab />
        </Tabs.Content>
        <Tabs.Content value="students">
          <StudentsTab />{" "}
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

function OverviewItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactElement;
  label: string;
  value: number;
  href: string;
}) {
  return (
    <GridItem asChild>
      <Card.Root size="sm" rounded={"xl"}>
        <Card.Body>
          <HStack>
            {icon}
            <Text fontSize="sm">{label}</Text>
          </HStack>
          <Card.Title my={5} fontSize={"2xl"}>
            <FormatNumber value={value} />
          </Card.Title>
          <Text asChild fontSize="sm" hidden>
            <Link href={href}>View All</Link>
          </Text>
        </Card.Body>
      </Card.Root>
    </GridItem>
  );
}
