import Surreal from "surrealdb.js";
import { record, z } from "zod";
import {
  Assignment,
  AssignmentDueDateValidator,
  AssignmentFilesValidator,
  AssignmentRegradeRequestValidator,
} from "../../../utils/types/Assignment";
import { AssignmentDatabaseInterface, AssignmentDatabaseInterfaceMethods, AssignmentDatabaseInterfaceMethods as methods } from "../../interface/AssignmentDatabaseInterface";
import {
  AssignmentAsRecord,
  MutableAssignmentAsRecord,
  RecordAsAssignment,
  SurrealAssignment,
} from "../schemas/Assignments";
import { getRecord, AssignmentTable } from "../utils";

const getAssignmentRecord = (id: string) => getRecord(AssignmentTable, id);

export const SurrealAssignmentInterface: (
  conn: Surreal
) => z.infer<typeof AssignmentDatabaseInterface> = (conn) => {
  const getAssignment = methods.getAssignment.strictImplement(async (id) => {
    try {
      return {
        success: true,
        data: RecordAsAssignment(
          SurrealAssignment.parse(
            (await conn.select(getAssignmentRecord(id)))[0]
          )
        ),
      };
    } catch (e) {
      return {
        success: true,
        data: null,
      };
    }
  });
  return AssignmentDatabaseInterface.parse({
    getAssignment: getAssignment,
    addAssignment: methods.addAssignment.strictImplement(async (ass) => {
      try {
        await conn.create(getAssignmentRecord(ass.id), AssignmentAsRecord(ass));
        return { success: true };
      } catch (e) {
        return {
          success: false,
          error: {
            message: e instanceof Error ? e.message : "",
            error: "DatabaseError",
          },
        };
      }
    }),
    editAssignment: methods.editAssignment.strictImplement(async (id, info) => {
      try {
        const assignment = await getAssignment(id);
        if(!assignment.success) return assignment
        if(!assignment.data) return {
          success: false,
          error: {
            error: "NotFound",
            message: `Assignment '${id}' not found.`
          }
        }
        assignment.data.update(info);
        await conn.update(
          getAssignmentRecord(id),
          AssignmentAsRecord(assignment.data)
        );
        return { success: true };
      } catch (e) {
        return {
          success: false,
          error: {
            message: e instanceof Error ? e.message : "",
            error: "DatabaseError",
          },
        };
      }
    }),
    deleteAssignment: methods.deleteAssignment.strictImplement(async (id) => {
      try {
        await conn.delete(getAssignmentRecord(id));
        return { success: true };
      } catch (e) {
        return {
          success: false,
          error: {
            message: e instanceof Error ? e.message : "",
            error: "DatabaseError",
          },
        };
      }
    }),
  });
};
