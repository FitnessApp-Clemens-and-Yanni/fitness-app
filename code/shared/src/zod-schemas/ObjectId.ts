import { z } from "zod";

export const OBJECT_ID_SCHEMA = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    "It seems like the id provided is not a valid MongoDB ObjectId.",
  );

