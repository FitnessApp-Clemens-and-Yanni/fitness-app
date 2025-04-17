import { z } from "zod";

export function postiveIntegerStringSchema(messageForWhenEmpty?: string) {
  return z
    .string({
      message: messageForWhenEmpty ?? "Please provide a valid string.",
    })
    .regex(/^\d+$/, "Please provide a valid positive integer.")
    .transform(Number);
}

export function positiveNumberStringSchema(messageForWhenEmpty?: string) {
  return z
    .string({
      message: messageForWhenEmpty ?? "Please provide a valid string.",
    })
    .regex(/^\d+\.?\d*$/, "Please provide a valid positive number.")
    .transform(Number);
}
