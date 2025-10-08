import { Card, Center } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function AuthenticationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Center minH={"100dvh"}>
        <Card.Root maxW={"sm"} w="full" borderWidth={"none"} rounded="xl">
          <Card.Body>{children}</Card.Body>
        </Card.Root>
      </Center>
    </>
  );
}
