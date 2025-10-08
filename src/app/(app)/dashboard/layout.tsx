"use client";
import { LogoText } from "@/app/components/LogoText";
import LogoutButton from "@/app/components/LogoutButton";
import MobileNavButton from "@/app/components/MobileNavMenu";
import { ColorModeButton } from "@/app/components/ui/color-mode";
import { Box, Button, ButtonGroup, Container, HStack } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box as="section">
        <Navbar isAdmin={true} />
        <Container maxW="5xl">{children}</Container>
      </Box>
    </>
  );
}

export function Navbar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  return (
    <Box as="nav" borderBottomWidth={"thin"}>
      <Container maxW={"5xl"}>
        <HStack justifyContent={"space-between"} py={5}>
          <Link href="/" replace>
            <LogoText />
          </Link>
          <ButtonGroup>
            <Button
              variant={pathname.endsWith("/carry-overs") ? "subtle" : "ghost"}
              colorPalette={"orange"}
              rounded={"full"}
              asChild
              hidden={isAdmin}
              hideBelow={'md'}
            >
              <Link href="/carry-overs">Carry Overs</Link>
            </Button>
            <Button
              variant={pathname.endsWith("/spill-overs") ? "subtle" : "ghost"}
              colorPalette={"orange"}
              rounded={"full"}
              asChild
              hidden={isAdmin}
              hideBelow={'md'}
            >
              <Link href="/spill-overs">Spill Overs</Link>
            </Button>
            <ColorModeButton hidden={false} rounded="full" variant="outline" />
            <LogoutButton hideBelow="md" />
            <MobileNavButton pathname={pathname} isAdmin={isAdmin} />
          </ButtonGroup>
        </HStack>
      </Container>
    </Box>
  );
}
