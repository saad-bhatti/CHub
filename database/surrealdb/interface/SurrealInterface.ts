import Surreal from "surrealdb.js";
import { z } from "zod";
import { DatabaseInterface } from "../../interface/DatabaseInterface";
import { UtilityDatabaseInterface } from "../../interface/UtilityDatabaseInterface";
import { surrealConnection } from "../conn";
import { SurrealAnnoucementInterface } from "./AnnouncementInterface";
import { SurrealAssignmentInterface } from "./AssignmentInterface";
import { SurrealCommentInterface } from "./CommentInterface";
import { SurrealCourseInterface } from "./CourseInterface";
import { SurrealPostInterface } from "./PostInterface";
import { SurrealUserInterface } from "./UserInterface";
import { SurrealUtilityInterface } from "./UtilityInterface";

const validator = DatabaseInterface.merge(UtilityDatabaseInterface).merge(z.object({conn: z.instanceof(Surreal)}))
export type SurrealInterface = z.infer<typeof validator>
export default async function SurrealInterface(): Promise<
  DatabaseInterface &
    UtilityDatabaseInterface & { conn: Surreal }
> {
  const conn = await surrealConnection();
  return validator.parse({
    conn: conn,
    ...SurrealUserInterface(conn),
    ...SurrealAnnoucementInterface(conn),
    ...SurrealCourseInterface(conn),
    ...SurrealUtilityInterface(conn),
    ...SurrealAssignmentInterface(conn),
    ...SurrealPostInterface(conn),
    ...SurrealCommentInterface(conn),
  });
}

