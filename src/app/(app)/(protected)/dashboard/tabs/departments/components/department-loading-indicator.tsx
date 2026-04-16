import { Box, HStack, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";

const noOfItems = 5;

export default function DepartmentLoadingIndicator() {


  return (
    <Box py={6}>
      <Indicators />
    </Box>
  );
}



  const Indicators = () => (
    <VStack align={"stretch"} >
      {Array.from({ length: noOfItems }).map((_, i) => {
        return <HStack p={3} overflow={"hidden"} w="full" key={i} gap={4}>
          <SkeletonCircle size={"12"} />
          <Skeleton loading flex={1} h={"5"} />
          <SkeletonCircle size={"10"} />
        </HStack>;
      })}
    </VStack>
  );