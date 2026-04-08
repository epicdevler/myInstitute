"use client";
import { LogoText } from "@/app/components/LogoText";
import { Field } from "@/app/components/ui/field";
import { PasswordInput } from "@/app/components/ui/password-input";
import {
  Alert,
  Button,
  Input,
  Span,
  Text,
  VStack
} from "@chakra-ui/react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState, useTransition } from "react";
import { commonProps } from "../signup/commonProps";

import { toaster } from "@/app/components/ui/toaster";
import { UserRepository } from "@/lib/repositories/remote/UserRepo";
import { useRouter } from "nextjs-toploader/app";

type LoginFields = { email: string; password: string };

type LoginFieldErrors = Partial<LoginFields> & { submitError?: string };

/** This page is used for the login functionality.
 * It is a placeholder for the login page.
 * It can be customized later to include a login form or other components.
 * * @returns {JSX.Element} The login page component.
 **/
export default function Page() {
  const router = useRouter();
  const [isSubmitting, submitTransition] = useTransition();

  const [values, setValues] = useState<LoginFields>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFieldErrors>({});

  function fieldHasErrors(): boolean {
    let foundError = false;
    const objectValues = Object.entries(values);
    objectValues.forEach(([key, value]) => {
      if (value.length < 1) {
        setErrors((prevErrors) => ({ ...prevErrors, [key]: "Required" }));
        foundError = true;
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [key]: undefined }));
      }
    });

    return foundError;
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const changeName = event.currentTarget.name;
    const value = event.currentTarget.value;

    setErrors((prevErrors) => ({ ...prevErrors, [changeName]: undefined }));
    setValues((prevValues) => ({
      ...prevValues,
      [changeName]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setErrors((prev) => ({
      ...prev,
      submitError: undefined,
    }));
    submitTransition(async () => {
      if (fieldHasErrors()) {
        return;
      }

      const userResponse = await new UserRepository().login(
        values.email,
        values.password
      );

      if (!userResponse.success) {
        setErrors((prev) => ({
          ...prev,
          submitError: userResponse.message!,
        }));

        return;
      }

      toaster.success({
        title: "Login Successfull",
        description: "Redirecting you...",
      });

      router.replace("/");
    });
  };

  return (
    <>
    <LogoText />
      
        <Text my={8} fontSize={"xl"} textAlign={'center'} w='full'>Welcome back</Text>        
      
      <Alert.Root hidden={!errors.submitError} status={"error"} mb={5}>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>{errors.submitError}</Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <VStack as="form" onSubmit={handleSubmit} align="stretch" gap="3">
        <Field
          label="Email"
          invalid={errors.email != null}
          errorText={errors.email}
        >
          <Input
            {...commonProps}
            type="email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
            placeholder="email@example.com"
          />
        </Field>
        <Field
          label="Password"
          invalid={errors.password != null}
          errorText={errors.password}
        >
          <PasswordInput
            {...commonProps}
            type="password"
            placeholder="*******"
            name="password"
            value={values.password}
            onChange={handleInputChange}
          />
        </Field>

        <Button
          type="submit"
          loading={isSubmitting}
          colorPalette={"blue"}
          rounded="full"
          mt={10}
        >
          Log In
        </Button>
        <Text mt={3} textAlign={"center"}>
          I don&apos;t have an account{" "}
          <Span
            asChild
            _hover={{ color: "blue" }}
            textDecor={"underline"}
            textUnderlineOffset={3}
          >
            <Link href="/auth/signup" replace>
              Join Now
            </Link>
          </Span>
        </Text>
      </VStack>
    </>
  );
}
