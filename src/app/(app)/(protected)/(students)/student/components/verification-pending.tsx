import { useLoadProfile } from "@/app/hooks/useLoadProfile";
import { Box, Button, Progress, Text } from "@chakra-ui/react";
import { LuRefreshCw } from "react-icons/lu";

export default function VerificationPending() {
  const invalidate = useLoadProfile().invalidate;
  return (
    <Box py={100}>
      <Text fontSize="xl">Awaiting Approval</Text>
      <Text color="fg.muted" mt={2}>
        Your account is being verified
      </Text>
      <Progress.Root mt={5} size="sm" value={null}>
        <Progress.Track rounded={"full"}>
          <Progress.Range rounded={"full"} />
        </Progress.Track>
      </Progress.Root>

      <Button onClick={invalidate} variant={"outline"} mt={7} rounded={"full"}>
        <LuRefreshCw /> Re check
      </Button>
    </Box>
  );
}
