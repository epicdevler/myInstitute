import {
  Heading,
  Tabs
} from "@chakra-ui/react";
import { LuFolder, LuNotebookPen, LuUser } from "react-icons/lu";
import CoursesTab from "./tabs/coures/CoursesTab";
import DepartmentsTab from "./tabs/departments/DepartmentsTab";
import StudentsTab from "./tabs/students/StudentsTab";

export default function Home() {
  return (
    <>
      <Heading mt={10} size="3xl">
        Hello, Admin
      </Heading>

      <Tabs.Root
        lazyMount
        w="full"
        variant={"outline"}
        my={20}
        defaultValue="departments"
      >
        <Tabs.List>
          <Tabs.Trigger value="departments">
            <LuFolder />
            Departments
          </Tabs.Trigger>
          <Tabs.Trigger value="courses">
            <LuNotebookPen />
            Courses
          </Tabs.Trigger>
          <Tabs.Trigger value="students">
            <LuUser />
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
