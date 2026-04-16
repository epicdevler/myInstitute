"use client";
import { UserContext } from "@/app/context/UserContext";
import { Heading, Tabs } from "@chakra-ui/react";
import { use } from "react";
import { LuFolder, LuNotebookPen, LuUser } from "react-icons/lu";
import CoursesTab from "./tabs/coures/CoursesTab";
import StaffTab from "./tabs/staffs/StaffTab";
import StudentsTab from "./tabs/students/StudentsTab";
import dynamic from "next/dynamic";

const DepartmentsTab = dynamic(
  () => import("./tabs/departments/DepartmentsTab"),
  { ssr: false },
);

export default function Home() {
  const user = use(UserContext).user;

  let tabItems = [
    {
      key: "members",
      label: "Members",
      component: <StaffTab />,
      icon: LuUser,
    },
    {
      key: "students",
      label: "Students",
      component: <StudentsTab />,
      icon: LuUser,
    },

    {
      key: "courses",
      label: "Courses",
      component: <CoursesTab />,
      icon: LuNotebookPen,
    },
  ];

  if (user?.role == "admin")
    tabItems = [
      {
        key: "departments",
        label: "Departments",
        component: <DepartmentsTab />,
        icon: LuFolder,
      },
      ...tabItems,
    ];

  const displayName = `${user?.staff?.title ?? user?.firstName} ${user?.lastName}`;
  return (
    <>
      <Heading mt={10} size="3xl">
        Hello, {displayName}
      </Heading>

      <Tabs.Root
        lazyMount
        w="full"
        variant={"outline"}
        my={20}
        defaultValue={tabItems[0].key}
      >
        <Tabs.List>
          {tabItems.map((item) => (
            <Tabs.Trigger key={item.key} value={item.key}>
              {<item.icon />}
              {item.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {tabItems.map((item) => (
          <Tabs.Content key={item.key} value={item.key}>
            {item.component}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </>
  );
}
