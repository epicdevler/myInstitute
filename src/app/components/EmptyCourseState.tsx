import { Box, EmptyState as ChakraEmptyState, Button } from "@chakra-ui/react";
import Link from "next/link";
import EmptyStateIllustration from "@public/assets/empty_state.svg";
import Image from "next/image";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionRedirect,
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionRedirect?: string;
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
        <ChakraEmptyState.Description>
          {description}
        </ChakraEmptyState.Description>
        {onAction && (
          <Button
            onClick={onAction}
            asChild={!!actionRedirect}
            mt={4}
            rounded="full"
            variant={"outline"}
          >
            {actionRedirect ? (
              <Link href={actionRedirect}>{actionLabel}</Link>
            ) : (
              actionLabel
            )}
          </Button>
        )}
      </ChakraEmptyState.Content>
    </ChakraEmptyState.Root>
  );
}
