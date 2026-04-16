import { Box, Button, EmptyState as ChakraEmptyState } from "@chakra-ui/react";
import Image from "next/image";
import EmptyStateIllustration from "@public/assets/empty_state.svg";

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <ChakraEmptyState.Root>
      <ChakraEmptyState.Content gap={2}>
        <ChakraEmptyState.Indicator>
          <Box asChild w="40">
            <Image src={EmptyStateIllustration} alt="Empty State" />
          </Box>
        </ChakraEmptyState.Indicator>
        <ChakraEmptyState.Title mt={10}>{title}</ChakraEmptyState.Title>
        <ChakraEmptyState.Description>{message}</ChakraEmptyState.Description>
        {onAction && (
          <Button onClick={onAction} mt={4} rounded="full" variant={"outline"}>
            {actionLabel}
          </Button>
        )}
      </ChakraEmptyState.Content>
    </ChakraEmptyState.Root>
  );
}
