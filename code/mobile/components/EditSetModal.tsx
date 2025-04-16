import { useForm } from "@tanstack/react-form";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

export function EditSetModal(props: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm({
    defaultValues: {
      weightsInKg: 0,
      repetitions: 0,
    },
  });

  return (
    <Modal visible={props.isVisible} transparent={true}>
      <TouchableOpacity
        className="flex-1 justify-center items-center bg-gray-50"
        onPress={() => props.setIsVisible(false)}
      >
        <View className="w-5/6 h-[90%] bg-white rounded-lg shadow">
          <form.Field
            name="weightsInKg"
            validators={{
              onChange: (val) =>
                val.value <= 0
                  ? "You cannot be only using 0 or less kilograms of weight."
                  : undefined,
            }}
          >
            {(field) => (
              <>
                <Text>Age:</Text>
                <TextInput
                  value={field.state.value.toString()}
                  onChangeText={(inp) => field.handleChange(+inp)}
                />
                {field.state.meta.errors ? (
                  <Text>{field.state.meta.errors.join(", ")}</Text>
                ) : null}
              </>
            )}
          </form.Field>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  /*
    <form.Field
    name="age"
    validators={{
      onChange: (val) =>
        val < 13 ? 'You must be 13 to make an account' : undefined,
    }}
  >
    {(field) => (
      <>
        <Text>Age:</Text>
        <TextInput value={field.state.value} onChangeText={field.handleChange} />
        {field.state.meta.errors ? (
          <Text>{field.state.meta.errors.join(', ')}</Text>
        ) : null}
      </>
    )}
  </form.Field>
    */
}
