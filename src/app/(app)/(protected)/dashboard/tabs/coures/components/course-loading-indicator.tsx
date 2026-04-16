import { Box, SkeletonText, SimpleGrid, Skeleton } from "@chakra-ui/react";

const noOfItems = 4;

export default function CourseLoadingIndicator() {


  return (
    <Box py={6}>
      <SkeletonText noOfLines={1} w={"28"} loading />
      <CourseIndicators />

      <SkeletonText mt={6} noOfLines={1} w={"28"} loading />
      <CourseIndicators />
    </Box>
  );
}



  const CourseIndicators = () => (
    <SimpleGrid columns={[2, 3, 4]} gap={[4]} mt={5}>
      {Array.from({ length: noOfItems }).map((_, i) => {
        return <Skeleton key={i} loading h={"44"} rounded={"xl"} />;
      })}
    </SimpleGrid>
  );