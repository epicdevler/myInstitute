import { Box, Button, EmptyState } from "@chakra-ui/react";
import Image from "next/image";
import ErrorStateIllustration from "../../../public/assets/error.svg";

export function ErrorState({
  title,
  message,
  onAction,
}: {
  title: string;
  message: string;
  onAction?: () => void;
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
        <Button
          hidden={!onAction}
          onClick={onAction}
          minW={20}
          mt={4}
          rounded="full"
          variant={"outline"}
        >
          Retry
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
