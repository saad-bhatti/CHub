import { z } from "zod";
export const Namespace = "CHub";
export const Database = "CHub";
export const AnnouncementTable = "Announcements";
export const CourseTable = "Courses";
export const UserTable = "Users";
export const AssignmentTable = "Assignments";
export const PostTable = "Posts";
export const CommentTable = "Comments";

export function getRecord(table: z.infer<typeof tables>, id: string) {
  return `${table}:${id}`;
}

const tables = z.enum([
  UserTable,
  CourseTable,
  AnnouncementTable,
  AssignmentTable,
  PostTable,
  CommentTable,
]);

export const SurrealIdValidator = (
  table: z.infer<typeof tables>,
  validator: z.ZodType
) =>
  z.string().refine((str) => {
    const [t, id] = str.split(":");
    validator.parse(id, {});
    return t == table;
  }, `ID does not start with ${table}.`);

// export function clear(){
//     syncSurrealConnection(async (conn) => {
//         return await conn.query(`
//             DELETE $t1;
//             DELETE $t2;
//             DELETE $t3;
//         `, {
//             t1: UserTable,
//             t2: CourseTable,
//             t3: AnnouncementTable
//         });
//     })
// };

// export function create(){
//     syncSurrealConnection(async (conn) => {
//         return await conn.query('INFO for kv', {
//             tb1: UserTable,
//             tb2: CourseTable,
//             tb3: AnnouncementTable
//         });
//     })
// }

// export function display(table: string){
//     syncSurrealConnection(async (conn) => {
//         return console.log(await conn.query(`
//             SELECT * FROM $t1;
//         `, {
//             t: table,
//         }));
//     })
// }
