
import { LogoText } from "@/app/components/LogoText";
import LogoutButton from "@/app/components/LogoutButton";
import { ColorModeButton } from "@/app/components/ui/color-mode";
import {
  Box,
  ButtonGroup,
  Container,
  Heading,
  HStack
} from "@chakra-ui/react";
import Link from "next/link";
import { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box as="section">
        <Navbar />
        <Container maxW="5xl">{children}</Container>
      </Box>
    </>
  );
}

function Navbar() {
  return (
    <Box as="nav" borderBottomWidth={"thin"}>
      <Container maxW={"5xl"}>
        <HStack justifyContent={"space-between"} py={5}>
          <Heading size="xl">
            <Link href="/" replace>
              <LogoText />
            </Link>{" "}
            Dashboard
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
