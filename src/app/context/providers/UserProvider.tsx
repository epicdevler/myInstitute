"use client";
import { firebaseAuth } from "@/lib/repositories/remote/config";
import { UserRepository } from "@/lib/repositories/remote/UserRepo";
import { Center, Spinner } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { UserContextUser } from "../UserContextType";
import { UserErrorState } from "./UserErrorState";

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContextUser>();
  // const [tempUser, setTempUser] = useState<UserContextUser>();
  const [userLoadingError, setUserLoadError] = useState<string>();
  const [isUserLoading, setUserLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (user && retry == 0) return;

    const unsub = async () => {
      setUserLoading(true);
      return onAuthStateChanged(
        firebaseAuth,
        async (user) => {
          if (user) {
            return await new UserRepository().getProfileObserve(
              user.uid,
              (userResponse) => {
                if (!userResponse.success) {
                  setUserLoadError(userResponse.message);
                  setUserLoading(false);
                  return;
                }
                setUser(userResponse.data as UserContextUser);
                setUserLoading(false);
                setRetry(0);
              }
            );
          }
        },
        /* onError = */ (error) => {
          setUserLoadError(error.message);
          setUserLoading(false);
        }
      );

      // return;
      // const userResponse = await new UserRepository().getProfile();

      // if (!userResponse.success) {
      //   setUserLoadError(userResponse.message);
      //   setUserLoading(false);
      //   return;
      // }

      // setUser(userResponse.data as UserContextUser);
      // setUserLoading(false);
      // setRetry(0);
    };

    unsub();
  }, [user, retry]);

  return (
    <UserContext.Provider
      value={{
        user,
        isLogginOut: false,
        setLoggingOut: () => {
          setRetry((prev) => prev + 1);
        },
      }}
    >
      <Center>
        {isUserLoading && (
          <Center p={4}>
            <Spinner />
          </Center>
        )}

        {!isUserLoading && userLoadingError && (
          <UserErrorState
            message={userLoadingError!}
            onRetry={() => setRetry((prev) => prev + 1)}
          />
        )}
        {!isUserLoading && user && children}
      </Center>
    </UserContext.Provider>
  );
}
