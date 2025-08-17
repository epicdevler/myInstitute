import { Field } from "@/app/components/ui/field";
import { toaster } from "@/app/components/ui/toaster";
import { useLoadDepartments } from "@/app/hooks/useLoadDepartments";
import { Course } from "@/lib/models/Course";
import { PouchCourseRepository } from "@/lib/repositories/PouchCourseRepo";
import {
  Alert,
  Button,
  CloseButton,
  createListCollection,
  Dialog,
  Heading,
  HStack,
  Input,
  InputGroup,
  Portal,
  Select,
  Span,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  FormEvent,
  useMemo,
  useState,
  useTransition,
} from "react";

type CourseFields = Omit<Course, "id" | "createdAt">;
type CourseFieldErrors = Partial<CourseFields> & { submitError?: string };
export default function CourseDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (success?: boolean) => void;
}) {
  const [isSubmitting, submitTransition] = useTransition();

  const [values, setValues] = useState<CourseFields>({
    title: "",
    code: "",
    creditUnit: "",
    description: "",
    departmentId: [],
  });
  const [errors, setErrors] = useState<CourseFieldErrors>({});

  const handleSubmit = (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    setErrors((prev) => ({ ...prev, submitError: undefined }));
    submitTransition(async () => {
      if (fieldHasErrors()) {
        return;
      }

      const response = await new PouchCourseRepository().add(values);

      if (!response.success) {
        setErrors((prev) => ({ ...prev, submitError: response.message }));
        return;
      }

      onClose(true);
      toaster.success({ description: "Courses added." });
    });
  };

  function fieldHasErrors(): boolean {
    const objectValues = Object.entries(values);
    let foundError = false;

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

  const { isLoading, loadingError, departments } = useLoadDepartments();

  const collection = useMemo(() => {
    return createListCollection({
      items: departments,
      itemToString: (department) => department.code,
      itemToValue: (department) => department.id,
    });
  }, [departments]);

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
              <Heading>Add Course</Heading>
            </Dialog.Header>
            <Dialog.Body>
              <Alert.Root hidden={!errors.submitError} status={"error"} mb={5}>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Login Failed</Alert.Title>
                  <Alert.Description>{errors.submitError}</Alert.Description>
                </Alert.Content>
              </Alert.Root>
              <Field
                label="Course Title"
                invalid={errors.title != undefined}
                errorText={errors.title}
              >
                <Input
                  name="title"
                  rounded={"full"}
                  type="text"
                  placeholder="Computer Architecture"
                  textTransform={"capitalize"}
                  value={values.title}
                  onChange={handleInputChange}
                />
              </Field>
              <HStack mt="4">
                <Field
                  label="Course Code"
                  invalid={errors.code != undefined}
                  errorText={errors.code}
                >
                  <Input
                    name="code"
                    rounded={"full"}
                    maxLength={7}
                    textTransform={"uppercase"}
                    type="text"
                    placeholder="CET 201"
                    value={values.code}
                    onChange={handleInputChange}
                  />
                </Field>

                <Field
                  label="Unit"
                  invalid={errors.creditUnit != undefined}
                  errorText={errors.creditUnit}
                >
                  <Input
                    name="creditUnit"
                    rounded={"full"}
                    type="number"
                    inputMode="numeric"
                    placeholder="3"
                    value={values.creditUnit}
                    onChange={handleInputChange}
                  />
                </Field>
              </HStack>

              <Field
                mt="4"
                label="Departments"
                invalid={
                  loadingError != undefined || errors.departmentId != undefined
                }
                errorText={loadingError || errors.departmentId}
              >
                <InputGroup
                  zIndex={1}
                  endElement={isLoading ? <Spinner /> : undefined}
                >
                  <Select.Root
                    rounded={"full"}
                    value={values.departmentId}
                    collection={collection}
                    size="sm"
                    multiple
                    disabled={isLoading}
                    positioning={{ strategy: "fixed", hideWhenDetached: true }}
                    onValueChange={(detail) => {
                      setValues((prev) => ({
                        ...prev,
                        departmentId: detail.value,
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
                    {/* <Portal disabled={true}> */}
                    <Select.Positioner>
                      <Select.Content>
                        {collection.items.map((department) => (
                          <Select.Item
                            item={department}
                            key={department.id}
                            cursor="pointer"
                          >
                            {department.name} {department.code}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                    {/* </Portal> */}
                  </Select.Root>
                </InputGroup>
              </Field>

              <Field
                mt="4"
                flex={"full"}
                label="Intro"
                helperText={
                  <Text fontSize={"md"}>
                    <Span>{values.description?.length || 0}</Span>/100
                  </Text>
                }
                maxLines={100}
                invalid={errors.description != undefined}
                errorText={errors.description}
              >
                <Textarea
                  name="description"
                  rows={5}
                  resize="none"
                  placeholder="In 100 characters briefly describe what this course is about"
                  value={values.description}
                  onChange={handleInputChange}
                />
              </Field>
            </Dialog.Body>
            <Dialog.Footer mt={10}>
              <Dialog.ActionTrigger disabled={isSubmitting} asChild>
                <Button variant={"ghost"} rounded={"full"}>
                  Close
                </Button>
              </Dialog.ActionTrigger>
              <Button
                loading={isSubmitting}
                type="submit"
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
