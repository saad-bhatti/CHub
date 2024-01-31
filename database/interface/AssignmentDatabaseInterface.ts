import { z } from "zod";
import {
  AssignmentIDValidator,
  AssignmentMutableInputValidator,
  AssignmentValidator
} from "../../utils/types/Assignment";
import { DatabaseResponseValidator, EmptyDatabaseResponseValidator } from "../types";

const addAssignment = z
  .function()
  .args(AssignmentValidator)
  .returns(EmptyDatabaseResponseValidator);

const getAssignment = z
  .function()
  .args(AssignmentIDValidator)
  .returns(DatabaseResponseValidator(AssignmentValidator.nullable()));

const deleteAssignment = z
  .function()
  .args(AssignmentIDValidator)
  .returns(EmptyDatabaseResponseValidator);

const editAssignment = z
  .function()
  .args(AssignmentIDValidator, AssignmentMutableInputValidator)
  .returns(EmptyDatabaseResponseValidator);

export const AssignmentDatabaseInterfaceMethods = {
  addAssignment,
  getAssignment,
  deleteAssignment,
  editAssignment,
};
export const AssignmentDatabaseInterface = z.object(AssignmentDatabaseInterfaceMethods);
export type AssignmentDatabaseInterface = z.infer<typeof AssignmentDatabaseInterface>;
