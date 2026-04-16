import { Field } from "@/app/components/ui/field";
import { toaster } from "@/app/components/ui/toaster";
import { useLoadDepartments } from "@/app/hooks/useLoadDepartments";
import { Course, LevelList, SemesterList } from "@/lib/models/Course";
import { CourseRepository } from "@/lib/repositories/remote/CourseRepo";
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
  RadioCard,
  Select,
  Span,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  ChangeEvent,
  SubmitEventHandler,
  useMemo,
  useState,
  useTransition
} from "react";

type CourseFields = Omit<Course, "id" | "createdAt">;
type CourseFieldErrors = Partial<
  Record<keyof CourseFields | "submitError", string>
>;

export default function CourseDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (success?: boolean) => void;
}) {
  const [isSubmitting, submitTransition] = useTransition();

  const { isLoading, error: loadingError, data: departments } = useLoadDepartments().query();

  const collection = useMemo(() => {
    return createListCollection({
      items: departments ?? [],
      itemToString: (department) => department.code,
      itemToValue: (department) => department.id,
    });
  }, [departments]);

  const [values, setValues] = useState<Partial<CourseFields>>({
    code: undefined,
    creditUnit: undefined,
    departmentId: undefined,
    description: undefined,
    level: undefined,
    semester: undefined,
    title: undefined,
  });
  const [errors, setErrors] = useState<CourseFieldErrors>({});

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const changeName = event.currentTarget.name;
    const value = event.currentTarget.value;

    setErrors((prevErrors) => ({ ...prevErrors, [changeName]: undefined }));
    setValues((prevValues) => ({
      ...prevValues,
      [changeName]: value,
    }));
  };

  function validateFields(fields: Partial<CourseFields>): CourseFieldErrors {
    const newErrors: CourseFieldErrors = {};

    for (const [key, value] of Object.entries(fields)) {
      if (!value || (typeof value === "string" && value.trim().length === 0)) {
        newErrors[key as keyof CourseFieldErrors] = "This field is required";
      }
    }

    return newErrors;
  }

  function fieldHasErrors(): boolean {
    const validationErrors = validateFields(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length > 0;
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setErrors((prev) => ({ ...prev, submitError: undefined }));
    submitTransition(async () => {
      if (fieldHasErrors()) {
        return;
      }

      const response = await new CourseRepository().add(values as CourseFields);

      if (!response.success) {
        setErrors((prev) => ({ ...prev, submitError: response.message }));
        return;
      }

      onClose(true);
      toaster.success({ description: "Courses added." });
    });
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
      lazyMount
    >
      <Dialog.Backdrop />
      <Portal>
        <Dialog.Positioner p={4}>
          <Dialog.Content asChild>
            <form onSubmit={handleSubmit}>
              <Dialog.Header>
                <Heading>Add Course</Heading>
              </Dialog.Header>
              <Dialog.Body gap={4}>
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
                    !!loadingError || !!errors.departmentId
                  }
                  errorText={loadingError?.message || errors.departmentId}
                >
                  <InputGroup
                    zIndex={1}
                    endElement={isLoading ? <Spinner /> : undefined}
                  >
                    <Select.Root
                      value={values.departmentId}
                      collection={collection}
                      // size="sm"
                      multiple
                      disabled={isLoading}
                      positioning={{ sameWidth: true, hideWhenDetached: true }}
                      onValueChange={(detail) => {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          departmentId: undefined,
                        }));
                        setValues((prev) => ({
                          ...prev,
                          departmentId: detail.value,
                        }));
                      }}
                    >
                      <Select.HiddenSelect />
                      <Select.Control>
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

                <HStack gap={4}>
                  <Field
                    label="Level"
                    mt="4"
                    invalid={errors.level != undefined}
                    errorText={errors.level}
                  >
                    <RadioCard.Root
                      value={values.level || undefined}
                      onValueChange={(detail) => {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          ["level"]: undefined,
                        }));
                        setValues((prevValues) => ({
                          ...prevValues,
                          level:
                            (detail?.value as CourseFields["level"]) ||
                            undefined,
                        }));
                      }}
                      size={"sm"}
                      w="full"
                    >
                      <HStack align="stretch">
                        {LevelList.map((level) => (
                          <RadioCard.Item
                            key={level}
                            value={level.replace(" ", "-")}
                            flex={1}
                            w={"full"}
                          >
                            <RadioCard.ItemHiddenInput />
                            <RadioCard.ItemControl>
                              <RadioCard.ItemText>{level}</RadioCard.ItemText>
                              <RadioCard.ItemIndicator />
                            </RadioCard.ItemControl>
                          </RadioCard.Item>
                        ))}
                      </HStack>
                    </RadioCard.Root>
                  </Field>

                  <Field
                    label="Semester"
                    mt="4"
                    invalid={errors.semester != undefined}
                    errorText={errors.semester}
                  >
                    <RadioCard.Root
                      value={values.semester || undefined}
                      w="full"
                      size="sm"
                      onValueChange={(detail) => {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          ["semester"]: undefined,
                        }));
                        setValues((prevValues) => ({
                          ...prevValues,
                          semester:
                            (detail?.value as CourseFields["semester"]) ||
                            undefined,
                        }));
                      }}
                    >
                      <HStack align="stretch">
                        {SemesterList.map((semester) => (
                          <RadioCard.Item
                            key={semester}
                            value={semester.toLocaleLowerCase()}
                          >
                            <RadioCard.ItemHiddenInput />
                            <RadioCard.ItemControl>
                              <RadioCard.ItemText>
                                {semester}
                              </RadioCard.ItemText>
                              <RadioCard.ItemIndicator />
                            </RadioCard.ItemControl>
                          </RadioCard.Item>
                        ))}
                      </HStack>
                    </RadioCard.Root>
                  </Field>
                </HStack>

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

                <Alert.Root
                  hidden={!errors.submitError}
                  status={"error"}
                  mt={5}
                >
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Login Failed</Alert.Title>
                    <Alert.Description>{errors.submitError}</Alert.Description>
                  </Alert.Content>
                </Alert.Root>
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
              <Dialog.CloseTrigger
                hidden={isSubmitting}
                asChild
                rounded={"full"}
              >
                <CloseButton />
              </Dialog.CloseTrigger>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
