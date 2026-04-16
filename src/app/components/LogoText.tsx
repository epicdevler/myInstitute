import { Heading, HStack, Image, StackProps } from "@chakra-ui/react";

export function LogoText(props: StackProps) {
  return (
    <HStack {...props}>
      <Image src="/assets/pti_logo.png" width={'14'} alt="" />      
        <Heading>PTI</Heading>      
    </HStack>
  );
}
