"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { useEffect } from "react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  useEffect(() => {
    const init = async () => {
      // await DBInitializer.init();
    };

    init();
  }, []);

  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
