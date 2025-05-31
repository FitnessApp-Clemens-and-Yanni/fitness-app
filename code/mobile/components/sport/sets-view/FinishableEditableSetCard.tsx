import { FontAwesomeIcon } from "@/components/font-awesome-icon";
import { Card } from "@/components/ui/Card";
import { AppColors as AppColors } from "@/lib/app-colors";
import { Set } from "@/lib/stores/sport/fe-sets-store";
import { Text, TouchableOpacity, View } from "react-native";

export function FinishableEditableSetCard(props: {
  set: Set;
  numberOfSetsInExercise: number;
  isMarkedAsFinished: boolean;
  onPressEdit: () => void;
  onToggleFinished: () => void;
  editable: boolean;
}) {
  return (
    <Card className="mb-1">
      <View
        className={`flex-1 flex-row justify-evenly items-center py-2 ${
          props.isMarkedAsFinished ? "bg-green-300" : ""
        }`}
      >
        <Text className="text-md">{props.set.weightsInKg.toFixed(2)}</Text>
        <Text className="text-md">{props.set.repetitions}</Text>
        <Text className="text-md">
          {(
            props.numberOfSetsInExercise *
            props.set.repetitions *
            props.set.weightsInKg
          ).toFixed(2)}
        </Text>
        {props.editable ? (
          <TouchableOpacity onPress={props.onPressEdit}>
            <FontAwesomeIcon
              name="pen"
              color={AppColors.GREY_700}
              className="scale-75"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={props.onToggleFinished}>
            <FontAwesomeIcon
              name="check"
              color={AppColors.GREY_700}
              className="scale-75"
            />
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
}
