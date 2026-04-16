"use client";
import { Box, Button, ButtonGroup, Container, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { use } from "react";
import { UserContext } from "../context/UserContext";
import { LogoText } from "./LogoText";
import LogoutButton from "./LogoutButton";
import MobileNavButton from "./MobileNavMenu";
import { ColorModeButton } from "./ui/color-mode";
import { usePathname } from "next/navigation";

export function Navbar() {
  const user = use(UserContext).user;
  const pathname = usePathname();
  const isAdmin = user?.role != "student";
  const isStudentVerified = !isAdmin && user.student?.status == "approved";

  return (
    <Box as="nav" borderBottomWidth={"thin"}>
      <Container maxW={"5xl"}>
        <HStack justifyContent={"space-between"} py={1}>
          <Link href="/" replace>
            <LogoText />
          </Link>
          <ButtonGroup>
            <Button
              variant={pathname.endsWith("/carry-overs") ? "subtle" : "ghost"}
              colorPalette={"blue"}
              rounded={"full"}
              asChild
              hidden={isAdmin || !isStudentVerified}
              hideBelow={"md"}
            >
              <Link href="/carry-overs">Carry Overs</Link>
            </Button>
            <Button
              variant={pathname.endsWith("/spill-overs") ? "subtle" : "ghost"}
              colorPalette={"blue"}
              rounded={"full"}
              asChild
              hidden={isAdmin || !isStudentVerified}
              hideBelow={"md"}
            >
              <Link href="/spill-overs">Spill Overs</Link>
            </Button>
            <ColorModeButton hidden={false} rounded="full" variant="outline" />
            <LogoutButton />
            {!isAdmin && (
              <MobileNavButton
                pathname={pathname}
                isAdmin={isAdmin}
                isStudentVerified={isStudentVerified}
              />
            )}
          </ButtonGroup>
        </HStack>
      </Container>
    </Box>
  );
}
