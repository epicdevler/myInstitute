"use client";
import { useLoadProfile } from "@/app/hooks/useLoadProfile";
import { firebaseAuth } from "@/lib/repositories/remote/config";
import { Center, Spinner } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { UserContextUser } from "../UserContextType";
import { UserErrorState } from "./UserErrorState";

export default function UserProvider({ children }: { children: ReactNode }) {
  const [authId, setAuthId] = useState<string>();

  const {
    isLoading: isUserLoading,
    error: profileError,
    refetch,
    data: profile,
  } = useLoadProfile().query(authId);

  const [userLoadingError, setUserLoadError] = useState<string>();

  const error = userLoadingError || profileError?.message;

  const isLoading = (!authId && !error) || isUserLoading;

  useEffect(() => {
    const unsub = async () => {
      return onAuthStateChanged(
        firebaseAuth,
        async (user) => {
          if (user) {
            setAuthId(user.uid);
          }
        },
        /* onError = */ (error) => {
          setUserLoadError(error.message);
        },
      );
    };

    unsub();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: profile ? (profile as UserContextUser) : undefined,
        isLogginOut: false,
        setLoggingOut: () => refetch(),
      }}
    >
      <Center flexDir={"column"}>
        {isLoading && (
          <Center minH="dvh" p={4}>
            <Spinner />
          </Center>
        )}

        {!isUserLoading && error && (
          <UserErrorState message={error} onRetry={() => refetch()} />
        )}
        {!isUserLoading && profile && children}
      </Center>
    </UserContext.Provider>
  );
}
