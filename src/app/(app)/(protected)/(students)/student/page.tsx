"use client";
import { UserContext } from "@/app/context/UserContext";
import { Heading, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { use } from "react";

const StudentCourses = dynamic(() => import("./components/courses"), {
  ssr: false,
});
const VerificationPending = dynamic(
  () => import("./components/verification-pending"),
  { ssr: false },
);
const VerificationDeclined = dynamic(
  () => import("./components/verification-declined"),
  { ssr: false },
);

export default function StudentHomePage() {
  const { user } = use(UserContext);

  const verificationStatus = {
    approved: user?.student?.status == "approved",
    declined: user?.student?.status == "declined",
    pending: !user?.student?.status || user?.student?.status == "pending",
  };

  return (
    <>
      <Heading mt={10} size="3xl">
        Welcome back, {user?.lastName}
      </Heading>
      <Text mt={2} mb={2}>
        Petroleom Training Institute, {user?.departmentId}
      </Text>

      {verificationStatus.approved && <StudentCourses />}

      {verificationStatus.declined && <VerificationDeclined />}

      {verificationStatus.pending && <VerificationPending />}

      {/* <EmptyCourseState /> */}
    </>
  );
}
