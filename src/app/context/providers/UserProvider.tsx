"use client";
import { PouchUserRepository } from "@/lib/repositories/PouchUserRepo";
import { Center, Spinner } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { UserContextUser } from "../UserContextType";
import { UserErrorState } from "./UserErrorState";
import { UsersDB } from "@/lib/pouchdbConfig";

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContextUser>();
  const [userLoadingError, setUserLoadError] = useState<string>();
  const [isUserLoading, setUserLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    
    if (user && retry == 0) return;

    const unsub = async () => {
      const userResponse = await new PouchUserRepository().getProfile();

      if (!userResponse.success) {
        setUserLoadError(userResponse.message);
        setUserLoading(false);
        return;
      }

      setUser(userResponse.data as UserContextUser);
      setUserLoading(false);
      setRetry(0)
    };

    unsub();
  }, [user, retry]);


  useEffect(() => {
    UsersDB.viewCleanup()
  })

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
