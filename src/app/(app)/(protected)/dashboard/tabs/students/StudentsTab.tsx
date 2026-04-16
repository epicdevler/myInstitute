"use client";
import { ErrorState } from "@/app/components/ErrorState";
import {
  Center,
  Heading,
  HStack,
  SegmentGroup,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import React, { use, useState } from "react";
import { useLoadStudents } from "../../../../../hooks/useLoadStudents";
import { StudentItem } from "./student-item";
import { EmptyState } from "@/app/components/EmptyCourseState";
import { UserContext } from "@/app/context/UserContext";
import { StudentDetailDrawer } from "./student-detail-drawer";
import StudentLoadingIndicator from "./components/students-loading-indicator";

export default function StudentsTab({
  departmentId,
}: {
  departmentId?: string;
}) {
  const user = use(UserContext).user;
  const isAdmin = user?.role == "admin";
  const [filterByStatus, setFilterByStatus] = useState<string>("approved");

  const departId =
    (departmentId ?? user?.role == "staff") ? user?.departmentId : undefined;

  const {
    isLoading,
    error: loadingError,
    data: students,
  } = useLoadStudents().query({
    role: ["student"],
    departmentId: departId ? [departId] : undefined,
  });

  const filteredStudents =
    students?.filter(
      (pred) =>
        (!pred.student?.status && filterByStatus == "pending") ||
        pred.student?.status == filterByStatus,
    ) ?? [];

  const [selectedStudentID, setSelectedStudentID] = React.useState<
    string | null
  >();

  const handleUserSelect = (studentId?: string) => {
    setSelectedStudentID(studentId);
  };

  return (
    <>
      <HStack py={5} mdDown={{}}>
        <Heading flex={1}>Students</Heading>

        <SegmentGroup.Root
          rounded={"md"}
          size="sm"
          mdDown={{ flex: 1, w: "fit" }}
          value={filterByStatus}
          disabled={isLoading}
          onValueChange={({ value }) => !!value && setFilterByStatus(value)}
        >
          <SegmentGroup.Indicator rounded={"md"} />
          <SegmentGroup.Item value="approved">
            <SegmentGroup.ItemHiddenInput />
            <SegmentGroup.ItemText>Approved</SegmentGroup.ItemText>
          </SegmentGroup.Item>
          <SegmentGroup.Item value="declined">
            <SegmentGroup.ItemHiddenInput />
            <SegmentGroup.ItemText>Declined</SegmentGroup.ItemText>
          </SegmentGroup.Item>
          <SegmentGroup.Item value="pending">
            <SegmentGroup.ItemHiddenInput />
            <SegmentGroup.ItemText>Pending</SegmentGroup.ItemText>
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </HStack>

      {isLoading && (<StudentLoadingIndicator />
      )}

      {!isLoading && loadingError && (
        <ErrorState
          title={"Failed to load students"}
          message={loadingError.message}
        />
      )}

      {!isLoading && !loadingError && (
        <>
          {filteredStudents.length < 1 ? (
            <EmptyState description={`No ${filterByStatus} students`} />
          ) : (
            <VStack align="stretch" cursor={"pointer"}>
              {filteredStudents.map((student, index) => {
                return (
                  <StudentItem
                    isAdmin={isAdmin}
                    sn={index + 1}
                    key={student.id}
                    student={student}
                    filteringStatus={filterByStatus}
                    onSelect={() => handleUserSelect(student.id)}
                  />
                );
              })}
            </VStack>
          )}
        </>
      )}

      {selectedStudentID && (
        <StudentDetailDrawer
          studentId={selectedStudentID}
          onClose={handleUserSelect}
        />
      )}
    </>
  );
}
