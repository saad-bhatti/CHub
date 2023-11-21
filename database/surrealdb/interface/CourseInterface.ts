import Surreal from "surrealdb.js";
import { z } from "zod";
import { CourseDatabaseInterface, CourseDatabaseInterfaceMethods as methods } from "../../interface/CourseDatabaseInterface";
import {
  RecordAsAnnouncement,
  SurrealAnnouncement,
} from "../schemas/Announcements";
import { RecordAsAssignment, SurrealAssignment } from "../schemas/Assignments";
import {
  CourseAsRecord,
  MutableCourseAsRecord,
  RecordAsCourse,
  SurrealCourse,
} from "../schemas/Courses";
import { RecordAsPost, SurrealPost } from "../schemas/Posts";
import { RecordAsUser, SurrealUser } from "../schemas/Users";
import {
  getRecord,
  UserTable,
  CourseTable,
  AnnouncementTable,
  AssignmentTable,
  PostTable,
} from "../utils";

const getCourseRecord = (id: string) => getRecord(CourseTable, id);

export const SurrealCourseInterface: (
  conn: Surreal
) => z.infer<typeof CourseDatabaseInterface> = (conn) => {
  const getCourse = methods.getCourse.strictImplement(async (id) => {
    try {
      return {
        success: true,
        data: RecordAsCourse(
          SurrealCourse.parse((await conn.select(getCourseRecord(id)))[0])
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
  return CourseDatabaseInterface.parse({
    getCourse: getCourse,
    addCourse: methods.addCourse.strictImplement(async (course) => {
      try {
        await conn.create(
          getCourseRecord(course.courseCode),
          CourseAsRecord(course)
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
    editCourse: methods.editCourse.strictImplement(async (id, info) => {
      try {
        const course = await getCourse(id);
        if(!course.success) return course;
        if(!course.data) return {
          success: false,
          error:{
            error: "NotFound",
            message: `Course ${id} not found.`
          }
        }
        course.data.update(info);
        await conn.update(getCourseRecord(id), CourseAsRecord(course.data));
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
    deleteCourse: methods.deleteCourse.strictImplement(async (id) => {
      try {
        await conn.delete(getCourseRecord(id));
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
    enrollUser: methods.enrollUser.strictImplement(async (id, code, type) => {
      try {
        if (type === undefined) {
          type = SurrealUser.parse(
            (await conn.select(getRecord(UserTable, id)))[0]
          ).type;
        }
        if (type === "Teacher") {
          await conn.modify(getCourseRecord(code), [
            {
              op: "add",
              path: "/instructors",
              value: [getRecord(UserTable, id)],
            },
          ]);
        } else {
          await conn.modify(getCourseRecord(code), [
            { op: "add", path: "/people", value: [getRecord(UserTable, id)] },
          ]);
        }
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
    unenrollUser: methods.unenrollUser.strictImplement(async (id, code, type) => {
      try {
        if (type === undefined) {
          type = SurrealUser.parse(
            (await conn.select(getRecord(UserTable, id)))[0]
          ).type;
        }
        await conn.query(
          `UPDATE ${getCourseRecord(code)} SET ${
            type === "Student" ? "people" : "instructors"
          } -= ${getRecord(UserTable, id)}`
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
    getCourseAnnouncements: methods.getCourseAnnouncements.strictImplement(async (id) => {
      try {
        const res = await conn.query(
          `select * from ${AnnouncementTable} where course = \'${getCourseRecord(
            id
          )}\'`
        );
        return {
          success: true,
          data: SurrealAnnouncement.array()
            .parse(res[0].result)
            .map(RecordAsAnnouncement),
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
    getCourseUsers: methods.getCourseUsers.strictImplement(async (id) => {
      try {
        const res = await conn.query(
          `select * from (select people from ${getCourseRecord(
            id
          )}) fetch ${UserTable}`
        );
        return {
          success: true,
          data: SurrealUser.array()
            .array()
            .parse(res[0].result)[0]
            .map(RecordAsUser),
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
    getCourseAssignments: methods.getCourseAssignments.implement(async (id) => {
      try {
        const res = await conn.query(
          `select * from ${AssignmentTable} where courseCode = ${getCourseRecord(
            id
          )}`
        );
        return {
          success: true,
          data: SurrealAssignment.array()
            .parse(res[0].result)
            .map(RecordAsAssignment),
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
    getCoursePosts: methods.getCoursePosts.strictImplement(async (id) => {
      try {
        const res = await conn.query(
          `select * from ${PostTable} where course = ${getCourseRecord(id)}`
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
