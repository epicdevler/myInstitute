import { Field } from "@/app/components/ui/field";
import { toaster } from "@/app/components/ui/toaster";
import { DepartmentRepository } from "@/lib/repositories/remote/DepartmentRepo";
import {
  Alert,
  Button,
  CloseButton,
  Dialog,
  Heading,
  HStack,
  Input,
  Portal,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, SubmitEventHandler, useState, useTransition } from "react";

type DepartmentFields = {
  name: string;
  code: string;
};
type DepartmentFieldErrors = Partial<DepartmentFields> & {
  submitError?: string;
};

export default function DepartmentDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (isSuccess?: boolean) => void;
}) {
  const [isSubmitting, submitTransition] = useTransition();

  const [values, setValues] = useState<DepartmentFields>({
    name: "",
    code: "",
  });

  const [errors, setErrors] = useState<DepartmentFieldErrors>({});

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    setErrors((prev) => ({ ...prev, submitError: undefined }));
    submitTransition(async () => {
      if (fieldHasErrors()) {
        return;
      }

      const response = await new DepartmentRepository().add(values);

      if (!response.success) {
        setErrors((prev) => ({ ...prev, submitError: response.message }));
        return;
      }

      onClose(true);
      toaster.success({ description: "Courses added." });
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

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const changeName = event.currentTarget.name;
    const value = event.currentTarget.value;

    setErrors((prevErrors) => ({ ...prevErrors, [changeName]: undefined }));
    setValues((prevValues) => ({
      ...prevValues,
      [changeName]: value,
    }));
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(detail) => {
        if (!detail.open) onClose();
      }}
      closeOnEscape={!isSubmitting}
      closeOnInteractOutside={!isSubmitting}
      scrollBehavior={"inside"}
      motionPreset="slide-in-bottom"
      unmountOnExit
    >
      <Dialog.Backdrop />
      <Portal>
        <Dialog.Positioner p={4}>
          <Dialog.Content as="form" onSubmit={handleSubmit}>
            <Dialog.Header>
              <Heading>Add Department</Heading>
            </Dialog.Header>
            <Dialog.Body>
              <HStack>
                <Field
                  flex={"full"}
                  label="Department Name"
                  invalid={errors.name != undefined}
                  errorText={errors.name}
                >
                  <Input
                    rounded={"full"}
                    type="text"
                    placeholder="Computer Engineering Technology"
                    textTransform={"capitalize"}
                    name="name"
                    onChange={handleInputChange}
                  />
                </Field>

                <Field
                  label="Code"
                  w={"1/5"}
                  invalid={errors.code != undefined}
                  errorText={errors.code}
                >
                  <Input
                    rounded={"full"}
                    maxLength={3}
                    textTransform={"uppercase"}
                    type="text"
                    placeholder="CET"
                    name="code"
                    onChange={handleInputChange}
                  />
                </Field>
              </HStack>

              <Alert.Root mt={5} hidden={!errors.submitError} status={"error"} >
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Login Failed</Alert.Title>
                  <Alert.Description>{errors.submitError}</Alert.Description>
                </Alert.Content>
              </Alert.Root>
            </Dialog.Body>
            <Dialog.Footer mt={10}>
              <Dialog.ActionTrigger asChild>
                <Button
                  disabled={isSubmitting}
                  variant={"ghost"}
                  rounded={"full"}
                >
                  Close
                </Button>
              </Dialog.ActionTrigger>
              <Button
                type="submit"
                loading={isSubmitting}
                rounded={"full"}
                minW={"28"}
              >
                Add
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger hidden={isSubmitting} asChild rounded={"full"}>
              <CloseButton />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
