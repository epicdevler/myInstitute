"use client";
import {
  Button,
  ButtonGroup,
  Dialog,
  Heading,
  IconButton,
  Portal,
} from "@chakra-ui/react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

export default function MobileNavButton({
  pathname,
  isAdmin,
  isStudentVerified,
}: {
  pathname: string;
  isAdmin?: boolean;
  isStudentVerified?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const closeDialog = () => setOpen(false);

  return (
    <>
      <Dialog.Root
        open={open}
        placement={"top"}
        motionPreset={"slide-in-top"}
        unmountOnExit
        scrollBehavior={"inside"}
        onOpenChange={(detail) => {
          setOpen(detail.open);
        }}
      >
        <Dialog.Trigger asChild>
          <IconButton rounded="full" variant={"outline"} hideFrom={"md"}>
            <Menu />
          </IconButton>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner p={4}>
            <Dialog.Content>
              <Dialog.Header>
                <Heading>Navigation Menu</Heading>
              </Dialog.Header>
              <Dialog.Body>
                <ButtonGroup flexDir="column" w="full">
                  <Button
                    onClick={closeDialog}
                    variant={
                      pathname.endsWith("/carry-overs") ? "subtle" : "outline"
                    }
                    colorPalette={"blue"}
                    rounded={"full"}
                    asChild
                    hidden={isAdmin || !isStudentVerified}
                    w="full"
                  >
                    <Link href="/carry-overs">Carry Overs</Link>
                  </Button>
                  <Button
                    onClick={closeDialog}
                    variant={
                      pathname.endsWith("/spill-overs") ? "subtle" : "outline"
                    }
                    colorPalette={"blue"}
                    rounded={"full"}
                    asChild
                    hidden={isAdmin || !isStudentVerified}
                    w="full"
                  >
                    <Link href="/spill-overs">Spill Overs</Link>
                  </Button>
                </ButtonGroup>
              </Dialog.Body>
              <Dialog.Footer justifyContent={"end"}>
                <ButtonGroup>
                  <LogoutButton />
                </ButtonGroup>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
