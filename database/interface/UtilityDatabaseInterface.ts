import { z } from "zod";
import { EmptyDatabaseResponseValidator } from "../types";

const createTable = z.function().args(z.string()).returns(EmptyDatabaseResponseValidator);

const displayTable = z.function().args(z.string()).returns(EmptyDatabaseResponseValidator);

const clearTable = z.function().args(z.string()).returns(EmptyDatabaseResponseValidator);

export const UtilityDatabaseInterfaceMethods = {
  createTable,
  displayTable,
  clearTable,
};
export const UtilityDatabaseInterface = z.object(UtilityDatabaseInterfaceMethods);
export type UtilityDatabaseInterface = z.infer<typeof UtilityDatabaseInterface>;
