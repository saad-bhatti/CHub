import { z, ZodType } from "zod";
import { errors } from "../utils/constants";

// Set up the database's response
const errorValidator = z.object({ error: errors, message: z.string() });
export const DatabaseResponseValidator = <T>(data: ZodType<T>) => {
  return z
    .discriminatedUnion("success", [
      z.object({ success: z.literal(true), data: data }),
      z.object({ success: z.literal(false), error: errorValidator }),
    ])
    .promise();
};
export const EmptyDatabaseResponseValidator = DatabaseResponseValidator(
  z.undefined()
);
