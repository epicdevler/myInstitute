"use client";
import { UserRepository } from "@/lib/repositories/remote/UserRepo";
import {
  Button,
  ButtonGroup,
  Dialog,
  Heading,
  Portal,
  Span,
} from "@chakra-ui/react";
import { LogOutIcon } from "lucide-react";
import { use, useState } from "react";
import { UserContext } from "../context/UserContext";

export default function LogoutButton({ hideBelow }: { hideBelow?: "md" }) {
  const { setLoggingOut } = use(UserContext);

  const [, /* logoutError */ setLogOutError] = useState<string>();
  const [loggingOut, setUserLoggingOut] = useState(false);

  const logOut = () => {
    const invoke = async () => {
      setLogOutError(undefined);
      setLoggingOut(true);
      setUserLoggingOut(true);
      const response = await new UserRepository().logout();

      if (!response.success) {
        setLogOutError(response.message);
        setLoggingOut(false);
        setUserLoggingOut(false);
        return;
      }

      location.replace("/");
    };
    invoke();
  };

  return (
    <>
      <Dialog.Root
        placement={"top"}
        unmountOnExit
        closeOnEscape={!loggingOut}
        closeOnInteractOutside={!loggingOut}
        scrollBehavior={"inside"}
      >
        <Dialog.Trigger asChild>
          <Button rounded="full" variant={"outline"} hideBelow={hideBelow}>
            <LogOutIcon /> <Span hideBelow={hideBelow}>Logout</Span>
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner p={4}>
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
