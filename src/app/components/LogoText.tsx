import { Box, Heading, HStack, Image, Text } from "@chakra-ui/react";

export function LogoText() {
  return (
    <HStack>
      <Image src="/assets/pti_logo.png" width={'14'} alt="" />
      <Box lineHeight={'short'}>
        <Text fontSize={"sm"}>PTI</Text>
        <Heading size={'md'}>Computer Eng. Tech</Heading>
      </Box>
    </HStack>
  );
}
