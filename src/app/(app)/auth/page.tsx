import { LogoText } from "@/app/components/LogoText";
import { Button, ButtonGroup, Text } from "@chakra-ui/react";
import Link from "next/link";


export default function AuthenticationPage() {
  return (
    <>
      <LogoText />

      <Text fontSize={'xl'} fontWeight={'bold'} mt={5}>
        Welcome
      </Text>
      <Text>Select how you would like to proceed</Text>

      <ButtonGroup gap={4} mt={20} align={"stretch"} w="full" flexDir="column">
        <Button asChild colorPalette={"orange"} rounded="full">
          <Link href="/auth/login">Log In</Link>
        </Button>
        <Button asChild variant={"outline"} rounded="full">
          <Link href="/auth/signup">Create Account</Link>
        </Button>
      </ButtonGroup>
    </>
  );
}
