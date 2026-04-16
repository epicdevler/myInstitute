import { Navbar } from "@/app/components/navbar";
import UserProvider from "@/app/context/providers/UserProvider";
import { Box, Container } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <UserProvider>
        <Box w="full" h="full" flex={1} as="section">
          <Navbar />
          <Container maxW="5xl">{children}</Container>
        </Box>
      </UserProvider>
    </>
  );
}
