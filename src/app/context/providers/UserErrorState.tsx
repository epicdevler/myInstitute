import { Box, Button, EmptyState } from "@chakra-ui/react";
import Image from "next/image";
import ErrorStateIllustration from "../../../../public/assets/error.svg";

export function UserErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void,
}) {
  return (
    <EmptyState.Root>
      <EmptyState.Content gap={2}>
        <EmptyState.Indicator>
          <Box asChild w="40">
            <Image src={ErrorStateIllustration} alt="Error State" />
          </Box>
        </EmptyState.Indicator>
        <EmptyState.Title mt={10}>{title}</EmptyState.Title>
        <EmptyState.Description>{message}</EmptyState.Description>
        <Button onClick={onRetry} mt={4} minW={'20'} rounded="full" variant={"outline"}>
          Retry
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
