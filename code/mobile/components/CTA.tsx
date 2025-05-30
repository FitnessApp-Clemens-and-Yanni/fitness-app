import { Button } from "@ui/Button";
import React from "react";

export function CTA(props: {
  children: React.ReactNode;
  className?: string;
  onPress: () => void;
}) {
  return (
    <Button className={`${props.className}`} onPress={props.onPress}>
      {props.children}
    </Button>
  );
}
