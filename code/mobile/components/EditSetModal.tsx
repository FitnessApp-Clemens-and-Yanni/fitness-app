import { AnyFieldApi, useForm } from "@tanstack/react-form";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from "zod";
import { Button } from "./ui/Button";
import {
  postiveIntegerStringSchema,
  positiveNumberStringSchema,
} from "@/lib/zodSchemas";
import { X } from "lucide-react-native";

const formSchema = z.object({
  weightsInKg: positiveNumberStringSchema(
    "Please provide the weights you want to use for the set."
  ),
  repetitions: postiveIntegerStringSchema(
    "Please provide how many reps the set has."
  ),
});

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

export function EditSetModal(props: {
  isModalVisible: boolean;
  hideModal: () => void;
  currentWeightsInKg: number;
  setCurrentWeightsInKg: (weights: number) => void;
  currentRepetitions: number;
  setCurrentRepetition: (weights: number) => void;
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
              <X />
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
                  props.setCurrentWeightsInKg(
                    +form.getFieldValue("weightsInKg")
                  );
                  props.setCurrentRepetition(
                    +form.getFieldValue("repetitions")
                  );
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
