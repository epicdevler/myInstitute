"use client";
import { PouchUserRepository } from "@/lib/repositories/PouchUserRepo";
import {
  Button,
  ButtonGroup,
  Dialog,
  Heading,
  Portal,
  Span,
} from "@chakra-ui/react";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { use, useState, useTransition } from "react";
import { UserContext } from "../context/UserContext";
export default function LogoutButton() {
  const router = useRouter();
  const { setLoggingOut } = use(UserContext);

  const [, /* logoutError */ setLogOutError] = useState<string>();
  const [loggingOut, logOutTransition] = useTransition();

  const logOut = () => {
    logOutTransition(async () => {
      setLoggingOut(true);
      const response = await new PouchUserRepository().logout();

      if (!response.success) {
        setLogOutError(response.message);
        setLoggingOut(false);
        return;
      }

      router.replace("/", { scroll: true });
    });
  };

  return (
    <>
      <Dialog.Root
        placement={"center"}
        unmountOnExit
        closeOnEscape={!loggingOut}
        closeOnInteractOutside={!loggingOut}
        scrollBehavior={"inside"}
      >
        <Dialog.Trigger asChild>
          <Button rounded="full" variant={"outline"}>
            <LogOutIcon /> <Span hideBelow="md">Logout</Span>
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Heading>Confirm Logout</Heading>
              </Dialog.Header>
              <Dialog.Body>
                <Dialog.Description>
                  Are you sure you want to procced?
                </Dialog.Description>
              </Dialog.Body>
              <Dialog.Footer justifyContent={"end"}>
                <ButtonGroup>
                  <Button
                    onClick={logOut}
                    loading={loggingOut}
                    rounded="full"
                    variant="outline"
                  >
                    Log Out
                  </Button>
                  <Dialog.ActionTrigger asChild>
                    <Button
                      rounded="full"
                      variant="surface"
                      colorPalette={"orange"}
                    >
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                </ButtonGroup>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
