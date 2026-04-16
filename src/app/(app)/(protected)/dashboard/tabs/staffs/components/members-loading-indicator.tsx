import { Box, HStack, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";

const noOfItems = 5;

export default function MembersLoadingIndicator() {


  return (
    <Box py={6}>
      <Indicators />
    </Box>
  );
}



  const Indicators = () => (
    <VStack align={"stretch"} gap={0} >
      {Array.from({ length: noOfItems }).map((_, i) => {
        return <HStack p={3} overflow={"hidden"} w="full" key={i} gap={4}>
          <SkeletonCircle size={"12"} />
          <Box  flex={1} spaceY={2}>
            <Skeleton w="sm" loading h={"5"} />
            <HStack>
              <Skeleton w="20" loading h={"4"} />
              <Skeleton w="20" loading h={"4"} />
            </HStack>
          </Box>
          <SkeletonCircle size={"10"} />
        </HStack>;
      })}
    </VStack>
  );