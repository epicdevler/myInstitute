import { Box, EmptyState, Button } from "@chakra-ui/react";
import Link from "next/link";
import EmptyStateIllustration from "@public/assets/empty_state.svg";
import Image from "next/image";

export function EmptyCourseState() {
  return (
    <EmptyState.Root>
      <EmptyState.Content gap={2}>
        <EmptyState.Indicator>
          <Box asChild w="40">
            <Image src={EmptyStateIllustration} alt="Empty State" />
          </Box>
        </EmptyState.Indicator>
        <EmptyState.Title mt={10}>
          You haven’t registered for any courses yet
        </EmptyState.Title>
        <EmptyState.Description>
          Browse available classes and enroll before the deadline.
        </EmptyState.Description>
        <Button asChild mt={4} rounded="full" variant={"outline"}>
          <Link href="/register-course">Register Courses</Link>
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
