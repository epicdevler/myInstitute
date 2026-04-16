import { Field } from "@/app/components/ui/field";
import { PasswordInput } from "@/app/components/ui/password-input";
import { toaster } from "@/app/components/ui/toaster";
import { useLoadDepartments } from "@/app/hooks/useLoadDepartments";
import { useLoadStudents } from "@/app/hooks/useLoadStudents";
import { Alert } from "@/components/ui/alert";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select";
import { UserRole } from "@/lib/models/User";
import {
  Box,
  Button,
  CloseButton,
  createListCollection,
  Dialog,
  Heading,
  HStack,
  Input,
  Portal,
  RadioCard,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import createStaffAction from "./creater-staff-action";
import { RoleOptions } from "./RoleOptions";


type Fields = {
  staffId: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId?: string;
  role: string;
  password: string;
};

export default function AddStaffDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const invalidate = useLoadStudents().invalidate;
  const {
    isLoading,
    error: departmentError,
    data: departments,
  } = useLoadDepartments().query();

  const collection = createListCollection({
    items: departments ?? [],
    itemToString: (department) => department.code.toUpperCase(),
    itemToValue: (department) => department.id,
  });

  const {
    handleSubmit,
    control,
    register,
    setError,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Fields>();

  const isStaffRole = watch("role") == "staff";

  const { mutate, isPending: isSubmitting } = useMutation({
    mutationKey: ["staffs", "create"],
    mutationFn: (data: Fields) =>
      createStaffAction({
        staff: {
          title: data.title,
          id: data.staffId,
        },
        firstName: data.firstName,
        lastName: data.lastName,
        departmentId: data.departmentId,
        email: data.email,
        role: data.role as UserRole,
        password: data.password,
        phone: data.phone,
      }).then((res) => {
        if (!res.success) throw Error(res.message);
      }),
    onSuccess: () => {
      toaster.success({ description: "Staff Created." });
      onClose();
      reset();
    },
    onError: (error) => {
      setError("root", { type: "request", message: error.message });
    },
    onSettled: invalidate,
  });

  const onSubmit = (data: Fields) => {
    // console.log("Data: ", data)
    mutate(data);
    // const response = await new CourseRepository().add(values as CourseFields);
    //   if (!response.success) {
    //     setErrors((prev) => ({ ...prev, submitError: response.message }));
    //     return;
    //   }
    //   onClose(true);
    //   toaster.success({ description: "Courses added." });
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Heading>Add Staff</Heading>
              </Dialog.Header>
              <Dialog.Body spaceY={3}>
                <Field
                  label="Title"
                  required
                  invalid={!!errors.title?.type}
                  errorText={errors.title?.message}
                >
                  <Input
                    rounded={"full"}
                    type="text"
                    placeholder="Mr., Engr., ..."
                    required={false}
                    textTransform={"capitalize"}
                    {...register("title", { required: true })}
                  />
                </Field>
                <HStack>
                  <Field
                    label="First Name"
                    required
                    invalid={!!errors.firstName?.type}
                    errorText={errors.firstName?.message}
                  >
                    <Input
                      rounded={"full"}
                      maxLength={7}
                      textTransform={"capitalize"}
                      type="text"
                      required={false}
                      placeholder="John"
                      {...register("firstName", {required: true})}
                    />
                  </Field>

                  <Field
                    required
                    label="Last Name"
                    invalid={!!errors.lastName?.type}
                    errorText={errors.lastName?.message}
                  >
                    <Input
                      rounded={"full"}
                      maxLength={7}
                      textTransform={"capitalize"}
                      type="text"
                      placeholder="Doe"
                      required={false}
                      {...register("lastName", { required: true })}
                    />
                  </Field>
                </HStack>

                <Field
                  label="Email"
                  required
                  invalid={!!errors.email?.type}
                  errorText={errors.email?.message}
                >
                  <Input
                    rounded={"full"}
                    type="email"
                    placeholder="email@example.com"
                    required={false}
                    {...register("email", {required: true})}
                  />
                </Field>

                <Field
                  required
                  label="Phone Number"
                  invalid={!!errors.phone?.type}
                  errorText={errors.phone?.message}
                  hidden
                >
                  <Input
                    rounded={"full"}
                    type="text"
                    placeholder="0808 000 0000"
                    required={false}
                    {...register("phone")}
                  />
                </Field>

                <Controller
                  control={control}
                  name={"role"}
                  rules={{ required: true }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => {
                    return (
                      <Field
                        label="Role"
                        mt="4"
                        required
                        invalid={!!error?.type}
                        errorText={error?.message}
                      >
                        <RadioCard.Root
                          value={value}
                          onValueChange={(detail) => {
                            onChange(detail.value);
                            if(detail.value == "admin") setValue("departmentId", undefined)
                          }}
                          size={"sm"}
                          w="full"
                          invalid={!!error?.type}
                          colorPalette={"blue"}
                        >
                          <HStack align="stretch">
                            {RoleOptions.map((item) => (
                              <RadioCard.Item
                                key={item.value}
                                value={item.value}
                                borderColor={
                                  !error?.type ? undefined : "border.error"
                                }
                                flex={1}
                                w={"full"}
                                rounded="full"
                              >
                                <RadioCard.ItemHiddenInput />
                                <RadioCard.ItemControl py={2}>
                                  <RadioCard.ItemText>
                                    {item.label}
                                  </RadioCard.ItemText>
                                  <RadioCard.ItemIndicator />
                                </RadioCard.ItemControl>
                              </RadioCard.Item>
                            ))}
                          </HStack>
                        </RadioCard.Root>
                      </Field>
                    );
                  }}
                />

                {isStaffRole && (
                  <Controller
                    control={control}
                    name={"departmentId"}
                    rules={{ required: true }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => {
                      return (
                        <Field
                          mt="4"
                          label="Departments"
                          required={isStaffRole}
                          invalid={
                            departmentError != undefined || !!error?.type
                          }
                          errorText={departmentError?.message || error?.message}
                        >
                          <SelectRoot
                            value={value ? [value] : undefined}
                            collection={collection}
                            disabled={isLoading}
                            positioning={{
                              sameWidth: true,
                              hideWhenDetached: true,
                            }}
                            onValueChange={(detail) => {
                              onChange(detail.value[0]);
                            }}
                          >
                            <SelectTrigger rounded="full">
                              <SelectValueText placeholder="Select Deparment" />
                            </SelectTrigger>

                            <SelectContent portalled>
                              {collection.items.map((department) => (
                                <SelectItem
                                  item={department}
                                  key={department.id}
                                  cursor="pointer"
                                  textTransform={"capitalize"}
                                  rounded={"2xl"}
                                >
                                  <Box>
                                    <Text
                                      fontSize="md"
                                      textTransform={"uppercase"}
                                    >
                                      {department.code}
                                    </Text>
                                    <Text color="fg.muted">
                                      {department.name}
                                    </Text>
                                  </Box>
                                  {/* <SelectItemIndicator /> */}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectRoot>
                        </Field>
                      );
                    }}
                  />
                )}

                <Field
                  label="Password"
                  required
                  invalid={!!errors.password?.type}
                  errorText={errors.password?.message}
                  helperText={"User should reset before login"}
                >
                  <PasswordInput
                    rounded={"full"}
                    required={false}
                    placeholder="Default Password"
                    {...register("password", { required: true })}
                  />
                </Field>

                <Alert
                  hidden={!errors.root?.type}
                  alignItems={"center"}
                  status={"error"}
                  mt={5}
                >
                  {errors.root?.message}
                </Alert>
              </Dialog.Body>
              <Dialog.Footer mt={10}>
                <Dialog.ActionTrigger disabled={isSubmitting} asChild>
                  <Button variant={"ghost"} rounded={"full"}>
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  loading={isSubmitting}
                  type="submit"
                  rounded={"full"}
                  minW={"28"}
                  colorPalette={"blue"}
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
