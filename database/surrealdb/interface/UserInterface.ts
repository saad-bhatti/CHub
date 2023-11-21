import Surreal from "surrealdb.js";
import { any, array, z } from "zod";
import { UserDatabaseInterface, UserDatabaseInterfaceMethods as methods } from "../../interface/UserDatabaseInterface";
import { RecordAsCourse, SurrealCourse } from "../schemas/Courses";
import { RecordAsPost, SurrealPost } from "../schemas/Posts";
import {
  MutableUserAsRecord,
  RecordAsUser,
  SurrealUser,
  UserAsRecord,
} from "../schemas/Users";
import {
  getRecord,
  UserTable,
  CourseTable,
  PostTable,
  CommentTable,
} from "../utils";
import { SurrealCourseInterface } from "./CourseInterface";

const getUserRecord = (id: string) => getRecord(UserTable, id);

export const SurrealUserInterface: (
  conn: Surreal
) => z.infer<typeof UserDatabaseInterface> = (conn) => {
  const getUser = methods.getUser.strictImplement(async (id) => {
    try {
      return {
        success: true,
        data: RecordAsUser(
          SurrealUser.parse((await conn.select(getUserRecord(id)))[0])
        ),
      };
    } catch (e) {
      return {
        success: true,
        data: null,
      };
      throw Error("Should not be here");
    }
  })
  const CourseInterface = SurrealCourseInterface(conn);
  return UserDatabaseInterface.parse({
    getUser: getUser,
    addUser: methods.addUser.strictImplement(async (user) => {
      try {
        await conn.create(getUserRecord(user.id), UserAsRecord(user));
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
    editUser: methods.editUser.strictImplement(async (id, info) => {
      try {
        const user = await getUser(id);
        if(!user.success) return user;
        if(!user.data) return {
          success: false,
          error: {
            error: "NotFound",
            message: `User ${id} not found`
          }
        }
        user.data.update(info);
        await conn.change(getUserRecord(id), UserAsRecord(user.data));
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
    deleteUser: methods.deleteUser.strictImplement(async (id) => {
      try {
        await conn.delete(getUserRecord(id));
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
    joinCourse: methods.joinCourse.strictImplement(async (id, code) => {
      try {
        const course = await CourseInterface.getCourse(code);
        if(!course.success) return course;
        if(!course.data) return {
          success: false,
          error: {
            error: "NotFound",
            message: `Course ${code} does not exist.`
          }
        }
        await conn.modify(getUserRecord(id), [
          {
            op: "add",
            path: "/enrolledCourses",
            value: [getRecord(CourseTable, code)],
          },
        ]);
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
    getUserCourses: methods.getUserCourses.strictImplement(async (id) => {
      try {
        const res = await conn.query(
          `select * from (select enrolledCourses from ${getRecord(
            UserTable,
            id
          )}) fetch Courses`
        );
        return {
          success: true,
          data: SurrealCourse.array()
            .array()
            .parse(res[0].result)[0]
            .map(RecordAsCourse),
        };
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
    getUserPosts: methods.getUserPosts.strictImplement(async (id) => {
      try {
        const res = await conn.query(
          `select * from ${PostTable} where owner = ${getRecord(UserTable, id)}`
        );
        return {
          success: true,
          data: SurrealPost.array().parse(res[0].result).map(RecordAsPost),
        };
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
    getCommentedPosts: methods.getCommentedPosts.strictImplement(async (id) => {
      try {
        const res = await conn.query(
          `select * from (select postId from ${CommentTable} where owner = ${getRecord(
            UserTable,
            id
          )}) fetch ${PostTable}`
        );
        return {
          success: true,
          data: SurrealPost.array().parse(res[0].result).map(RecordAsPost),
        };
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
