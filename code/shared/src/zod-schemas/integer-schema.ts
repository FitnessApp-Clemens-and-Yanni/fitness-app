import { z } from "zod";

export function postiveIntegerStringSchema(
  messageForWhenEmpty?: string,
  options: { zeroAllowed: boolean } = { zeroAllowed: true },
) {
  const obj = z
    .string({
      message: messageForWhenEmpty ?? "Please provide a valid string.",
    })
    .regex(/^\d+$/, "Please provide a valid positive integer.");

  if (options.zeroAllowed === false) {
    return obj
      .refine((str) => +str !== 0, "You cannot use 0 as a value.")
      .transform(Number);
  }

  return obj.transform(Number);
}

export function positiveNumberStringSchema(
  messageForWhenEmpty?: string,
  options: { zeroAllowed: boolean } = { zeroAllowed: true },
) {
  const obj = z
    .string({
      message: messageForWhenEmpty ?? "Please provide a valid string.",
    })
    .regex(/^\d+\.?\d*$/, "Please provide a valid positive number.");

  if (options.zeroAllowed === false) {
    return obj
      .refine((str) => +str !== 0, "You cannot use 0 as a value.")
      .transform(Number);
  }

  return obj.transform(Number);
}
