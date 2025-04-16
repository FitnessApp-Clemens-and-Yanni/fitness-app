import { Text } from "react-native";

export function TimeDisplay(props: {
  timeInMinutes: number;
  className?: string;
}) {
  return (
    <Text className={props.className ?? ""}>
      {Math.floor(props.timeInMinutes).toString().padStart(2, "0")}:
      {Math.floor(props.timeInMinutes * 60)
        .toString()
        .padStart(2, "0")}
    </Text>
  );
}
