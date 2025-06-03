import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { z } from "zod/v4";
import { Button } from "@ui/Button";
import {
  postiveIntegerStringSchema,
  positiveNumberStringSchema,
} from "shared/build/zod-schemas/integer-schema.js";
import { FontAwesomeIcon } from "../font-awesome-icon";
import { AppColors } from "@/lib/app-colors";

const formSchema = z.object({
  weightsInKg: positiveNumberStringSchema(
    "Please provide the weights you want to use for the set.",
    { zeroAllowed: false },
  ),
  repetitions: postiveIntegerStringSchema(
    "Please provide how many reps the set has.",
    { zeroAllowed: false },
  ),
});

export function EditSetModal(props: {
  isModalVisible: boolean;
  hideModal: () => void;
  currentWeightsInKg: number;
  currentRepetitions: number;
  setCurrentSet: (weights: number, reps: number) => void;
}) {
  const form = useForm({
    defaultValues: {
      weightsInKg: `${props.currentWeightsInKg}`,
      repetitions: `${props.currentRepetitions}`,
    },
    validators: {
      onChange: formSchema,
    },
  });

  return (
    <Modal visible={props.isModalVisible} transparent={true}>
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="w-5/6 h-[90%] bg-white rounded-lg shadow gap-3 p-5">
          <View className="flex-row justify-end mb-5">
            <TouchableOpacity onPressIn={props.hideModal}>
              <FontAwesomeIcon name="times" color={AppColors.GRAY_800} />
            </TouchableOpacity>
          </View>
          <form.Field name="weightsInKg">
            {(field) => (
              <View className="gap-2">
                <Label>Weights (in kg):</Label>
                <Input
                  value={field.state.value.toString()}
                  onChangeText={field.handleChange}
                />
                <FieldInfo field={field} />
              </View>
            )}
          </form.Field>

          <form.Field name="repetitions">
            {(field) => (
              <View className="gap-2">
                <Label>Reps:</Label>
                <Input
                  value={field.state.value}
                  onChangeText={field.handleChange}
                />
                <FieldInfo field={field} />
              </View>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit}
                onPressIn={() => {
                  props.setCurrentSet(
                    +form.getFieldValue("weightsInKg"),
                    +form.getFieldValue("repetitions"),
                  );

                  props.hideModal();
                }}
              >
                <Text>{isSubmitting ? "..." : "OK"}</Text>
              </Button>
            )}
          ></form.Subscribe>
        </View>
      </View>
    </Modal>
  );
}

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <Text className="text-sm text-red-500">
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </Text>
      ) : null}
    </>
  );
}
