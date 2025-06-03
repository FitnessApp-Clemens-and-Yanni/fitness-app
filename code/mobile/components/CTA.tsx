import { Button } from "@ui/Button";
import React from "react";
import { Text } from "react-native";

export function CTA(props: {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  onPress: () => void;
}) {
  return (
    <Button className={`${props.className}`} onPress={props.onPress}>
      {props.text === undefined ? (
        props.children
      ) : (
        <Text className="text-primary-foreground font-bold">{props.text}</Text>
      )}
    </Button>
  );
}
