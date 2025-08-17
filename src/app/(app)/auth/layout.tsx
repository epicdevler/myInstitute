import { Toaster } from "@/app/components/ui/toaster";
import { Box, Center } from "@chakra-ui/react";
import { ReactNode } from "react";

export default function AuthenticationLayout({children}:{children: ReactNode}){
    return (
        <>
        <Center minH={'100dvh'}>
            <Box maxW={'sm'} w='full' borderWidth={'none'} rounded='xl' p={4}>{children}</Box>
        </Center>
        
        
        <Toaster />
        </>
    )
}