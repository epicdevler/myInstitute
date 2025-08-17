import { LogoText } from "@/app/components/LogoText";
import LogoutButton from "@/app/components/LogoutButton";
import { ColorModeButton } from "@/app/components/ui/color-mode";
import UserProvider from "@/app/context/providers/UserProvider";
import { Box, ButtonGroup, Container, Heading, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box as="section">
        <Navbar />
        <UserProvider>
          <Container maxW="5xl">{children}</Container>
        </UserProvider>
      </Box>
    </>
  );
}

function Navbar() {
  return (
    <Box as="nav" borderBottomWidth={"thin"}>
      <Container maxW={"5xl"}>
        <HStack justifyContent={"space-between"} py={5}>
          <Heading asChild size="xl">
            <Link href="/" replace>
              <LogoText />
            </Link>
          </Heading>
          <ButtonGroup>
            <ColorModeButton rounded="full" variant="outline" />
            <LogoutButton />
          </ButtonGroup>
        </HStack>
      </Container>
    </Box>
  );
}
