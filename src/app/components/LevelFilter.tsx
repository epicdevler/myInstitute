"use client";
import { LevelList } from "@/lib/models/Course";
import { HStack, Text, RadioCard } from "@chakra-ui/react";

export function LevelFilter({
  value,
  onSelect,
  disabled
}: {
  value?: string;
  onSelect?: (level: string) => void;
  disabled?: boolean,
}) {
  return (
    <HStack>
      <Text>By Level</Text>

      <RadioCard.Root
      disabled={disabled}
        colorPalette="blue"
        value={value}
        onValueChange={(detail) => {
          onSelect?.(detail.value || "");
        }}
        w="max-content"
        size="sm"
      >
        <HStack>
          {LevelList.map((level) => (
            <RadioCard.Item
              key={level}
              value={level}
              cursor={"pointer"}
              rounded={"full"}
              minW={"fit-content"}
              
            >
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl px={2} py={1}>
                <RadioCard.ItemText minW={"14"} textAlign={"center"}>
                  {level}
                </RadioCard.ItemText>
              </RadioCard.ItemControl>
            </RadioCard.Item>
          ))}
        </HStack>
      </RadioCard.Root>
    </HStack>
  );
}
