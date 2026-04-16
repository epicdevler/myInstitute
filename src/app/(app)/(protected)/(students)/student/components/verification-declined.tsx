import { useLoadProfile } from "@/app/hooks/useLoadProfile";
import { Button, Center, Text } from "@chakra-ui/react";
import { LuCircleAlert, LuRefreshCw } from "react-icons/lu";

export default function VerificationDeclined() {
  const invalidate = useLoadProfile().invalidate;

  return (
    <Center flexDir={"column"} py={100}>
      <Text
        fontSize="xl"
        color="fg.error"
        display={"flex"}
        alignItems={"center"}
        gap={2}
      >
        <LuCircleAlert /> Declined
      </Text>
      <Text color="fg.muted" mt={2}>
        Your application was declined
      </Text>
      <Button onClick={invalidate} variant={"outline"} mt={7} rounded={"full"}>
        <LuRefreshCw /> Re check
      </Button>
    </Center>
  );
}
