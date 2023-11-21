import { z } from "zod";
import {
  Assignment,
  AssignmentDueDateValidator,
  CommentValidator,
  AssignmentRegradeRequestValidator,
  AssignmentIDValidator,
  AssignmentMutableInputValidator,
  AssignmentPermenantAttributes,
  AssignmentTitleValidator,
  AssignmentWeightValidator,
  GradeValidator,
} from "../../../utils/types/Assignment";
import { CourseCodeValidator } from "../../../utils/types/Course";
import { UserIdValidator } from "../../../utils/types/User";
import {
  AssignmentTable,
  CourseTable,
  getRecord,
  SurrealIdValidator,
  UserTable,
} from "../utils";

const SurrealUserID = SurrealIdValidator(UserTable, UserIdValidator);
export const SurrealAssignment = z.object({
  id: SurrealIdValidator(AssignmentTable, AssignmentIDValidator),
  weight: AssignmentWeightValidator,
  courseCode: SurrealIdValidator(CourseTable, CourseCodeValidator),
  grades: z.record(SurrealIdValidator(UserTable, UserIdValidator), GradeValidator),
  comments: z.record(SurrealIdValidator(UserTable, UserIdValidator), CommentValidator),
  regrade: z.union([z.set(SurrealUserID), z.array(SurrealUserID)]).transform(s => s instanceof Set? Array.from(s) : s),
  title: AssignmentTitleValidator,
  files: z.union([z.set(SurrealUserID), z.array(SurrealUserID)]).transform(s => s instanceof Set? Array.from(s) : s),
  dueDate: AssignmentDueDateValidator,
});

export const MutableSurrealAssignment = SurrealAssignment.omit(
  AssignmentPermenantAttributes
);

export function AssignmentAsRecord(
  ass: Assignment
): z.infer<typeof SurrealAssignment> {
  return SurrealAssignment.parse({
    id: getRecord(AssignmentTable, ass.id),
    weight: ass.weight,
    courseCode: getRecord(CourseTable, ass.courseCode),
    title: ass.title,
    dueDate: ass.dueDate,
    grades: Object.fromEntries(
      Array.from(Object.entries(ass.grades)).map(([user, grade]) => [
        getRecord(UserTable, user),
        grade,
      ])
    ),
    comments: Object.fromEntries(
      Array.from(
        Object.entries(ass.comments).map(([user, comment]) => [
          getRecord(UserTable, user),
          comment,
        ])
      )
    ),
    regrade: Array.from(ass.regrade).map((id) => getRecord(UserTable, id)),
    files: Array.from(ass.files).map((id) => getRecord(UserTable, id)),
  });
}

export function MutableAssignmentAsRecord(
  ass: z.infer<typeof AssignmentMutableInputValidator>
): z.infer<typeof MutableSurrealAssignment> {
  return MutableSurrealAssignment.parse({
    weight: ass.weight,
    title: ass.title,
    dueDate: ass.dueDate,
    grades: Object.fromEntries(
      Array.from(Object.entries(ass.grades)).map(([user, grade]) => [
        getRecord(UserTable, user),
        grade,
      ])
    ),
    comments: Object.fromEntries(
      Array.from(
        Object.entries(ass.comments).map(([user, comment]) => [
          getRecord(UserTable, user),
          comment,
        ])
      )
    ),
    regrade: Array.from(ass.regrade).map((id) => getRecord(UserTable, id)),
    files: Array.from(ass.files).map((id) => getRecord(UserTable, id)),
  });
}

export function RecordAsAssignment(
  obj: z.infer<typeof SurrealAssignment>
): Assignment {
  return new Assignment({
    id: obj.id.substr(AssignmentTable.length + 1),
    weight: obj.weight,
    dueDate: obj.dueDate,
    grades: Object.fromEntries(
      Array.from(Object.entries(obj.grades)).map(([user, grade]) => [
        user.substr(UserTable.length + 1),
        grade,
      ])
    ),
    comments: Object.fromEntries(
      Array.from(Object.entries(obj.comments)).map(([user, comment]) => [
        user.substr(UserTable.length + 1),
        comment,
      ])
    ),
    regrade: new Set(obj.regrade.map((id) => id.substr(UserTable.length + 1))),
    title: obj.title,
    files: new Set(obj.files.map((id) => id.substr(UserTable.length + 1))),
    courseCode: obj.courseCode.substr(CourseTable.length + 1),
  });
}
