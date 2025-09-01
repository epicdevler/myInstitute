"use client";
import { useLoadDepartments } from "@/app/hooks/useLoadDepartments";
import { Field } from "@/app/components/ui/field";
import { PasswordInput } from "@/app/components/ui/password-input";
import { toaster } from "@/app/components/ui/toaster";
import { UserRepository } from "@/lib/repositories/remote/UserRepo";
import {
  Alert,
  Button,
  createListCollection,
  Heading,
  HStack,
  Input,
  InputGroup,
  Portal,
  Select,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
  useTransition,
} from "react";
import { commonProps } from "./commonProps";

type LoginFields = {
  firstName: string;
  lastName: string;
  departmentId: string;
  email: string;
  password: string;
};

type LoginFieldErrors = Partial<LoginFields> & { submitError?: string };

/** This page is used for the sign up functionality.
 * It is a placeholder for the sign up page.
 * It can be customized later to include a sign up form or other components.
 * * @returns {JSX.Element} The sign up page component.
 **/
export default function Page() {
  const router = useRouter();
  const [isSubmitting, submitTransition] = useTransition();

  const [values, setValues] = useState<LoginFields>({
    firstName: "",
    lastName: "",
    departmentId: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFieldErrors>({});

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

      const userResponse = await new UserRepository().signup({
        firstName: values.firstName,
        lastName: values.lastName,
        departmentId: values.departmentId,
        email: values.email,
        password: values.password,
        role: "student",
        registeredCourses: [],
      });

      if (!userResponse.success) {
        setErrors((prev) => ({
          ...prev,
          submitError: userResponse.message!,
        }));
        return;
      }

      toaster.success({
        title: "Account created successfully",
        description: "Logging you in",
      });

      router.replace("/auth/login");
    });
  };

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

  const { isLoading, loadingError, departments } = useLoadDepartments();

  const collection = useMemo(() => {
    return createListCollection({
      items: departments,
      itemToString: (pokemon) => pokemon.name + " " + pokemon.code,
      itemToValue: (pokemon) => pokemon.id,
    });
  }, [departments]);

  return (
    <>
      <Heading size="3xl">Sign Up</Heading>
      <Text mb={5}></Text>

      <Alert.Root hidden={!errors.submitError} status={"error"} mb={5}>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Login Failed</Alert.Title>
          <Alert.Description>{errors.submitError}</Alert.Description>
        </Alert.Content>
      </Alert.Root>

      <VStack as="form" onSubmit={handleSubmit} align="stretch" gap="3">
        <HStack>
          <Field
            label="First Name"
            invalid={errors.firstName != null}
            errorText={errors.firstName}
          >
            <Input
              {...commonProps}
              type="text"
              placeholder="John"
              name="firstName"
              value={values.firstName}
              onChange={handleInputChange}
            />
          </Field>
          <Field
            label="Last Name"
            invalid={errors.lastName != null}
            errorText={errors.lastName}
          >
            <Input
              {...commonProps}
              type="text"
              placeholder="Doe"
              name="lastName"
              value={values.lastName}
              onChange={handleInputChange}
            />
          </Field>
        </HStack>
        <Field
          label="Department"
          invalid={
            loadingError != undefined || errors.departmentId != undefined
          }
          errorText={loadingError || errors.departmentId}
        >
          <InputGroup endElement={isLoading ? <Spinner /> : undefined}>
            <Select.Root
              rounded={"full"}
              value={[values.departmentId]}
              collection={collection}
              size="sm"
              disabled={isLoading}
              onValueChange={(detail) => {
                setValues((prev) => ({
                  ...prev,
                  departmentId: detail.value[0],
                }));
              }}
            >
              <Select.HiddenSelect />
              <Select.Control rounded="full">
                <Select.Trigger rounded="full">
                  <Select.ValueText placeholder="Select Deparment" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {collection.items.map((framework) => (
                      <Select.Item
                        item={framework}
                        key={framework.id}
                        cursor="pointer"
                      >
                        {framework.name} {framework.code}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </InputGroup>
        </Field>
        <Field
          label="Email"
          invalid={errors.email != null}
          errorText={errors.email}
        >
          <Input
            {...commonProps}
            type="email"
            placeholder="email@example.com"
            name="email"
            value={values.email}
            onChange={handleInputChange}
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
          loading={isSubmitting}
          type="submit"
          colorPalette={"orange"}
          rounded="full"
          mt={10}
        >
          Create Account
        </Button>

        <Text asChild mt={3} textAlign={"center"}>
          <Link href="/auth/login" replace>
            Already have an account
          </Link>
        </Text>
      </VStack>
    </>
  );
}
