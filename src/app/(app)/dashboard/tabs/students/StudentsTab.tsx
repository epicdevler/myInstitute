import {
  Box,
  Center,
  Circle,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuItem,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MoreVerticalIcon } from "lucide-react";

export default function StudentsTab() {
  return (
    <>
      <Heading py={5}>Students</Heading>

      <VStack align="stretch" pt={8} cursor={"pointer"}>
        <HStack p={3} rounded="xl" gap={4} _hover={{ bg: "bg.subtle" }}>
          <Center boxSize={"10"} rounded="full" borderWidth={"thin"}>
            1
          </Center>
          <Box flex={1}>
            <Text fontSize="lg">Richard Surname</Text>
            <HStack
              align={["start", null, "center"]}
              gap={[1, null, 4]}
              flexDir={["column", null, "row"]}
              color="fg.muted"
            >
              <Text fontSize="sm">10 Cources Registered</Text>
              <Circle size={1} bg="bg.inverted" hideBelow={"md"} />
              <Text fontSize="sm">CET</Text>
            </HStack>
          </Box>
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton variant="ghost" rounded="full">
                <MoreVerticalIcon />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <MenuItem cursor="pointer" value="edit">
                    Edit
                  </MenuItem>
                  <MenuItem cursor="pointer" value="delete">
                    Delete
                  </MenuItem>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </HStack>
      </VStack>
    </>
  );
}
