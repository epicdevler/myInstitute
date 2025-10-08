import { Box, EmptyState as ChakraEmptyState, Button } from "@chakra-ui/react";
import Link from "next/link";
import EmptyStateIllustration from "@public/assets/empty_state.svg";
import Image from "next/image";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionRedirect,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionRedirect?: string;
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
        <Button asChild mt={4} rounded="full" variant={"outline"}>
          <Link href={actionRedirect ?? "#"}>{actionLabel}</Link>
        </Button>
      </ChakraEmptyState.Content>
    </ChakraEmptyState.Root>
  );
}
