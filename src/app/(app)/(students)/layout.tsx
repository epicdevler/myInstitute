import UserProvider from "@/app/context/providers/UserProvider";
import { Box, Container } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Navbar } from "../dashboard/layout";

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

