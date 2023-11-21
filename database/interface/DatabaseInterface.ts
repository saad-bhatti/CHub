import {
  UserDatabaseInterface,
  //FakeUserDatabaseAccessor,
} from "./UserDatabaseInterface";
import {
  CourseDatabaseInterface,
  //FakeCourseDatabaseAccessor,
} from "./CourseDatabaseInterface";
import {
  AnnouncementDatabaseInterface,
  //FakeAnnouncementDatabaseAccessor,
} from "./AnnouncementDatabaseInterface";
import {
  AssignmentDatabaseInterface,
  //FakeAssignmentDatabaseAccessor,
} from "./AssignmentDatabaseInterface";
import { PostDatabaseInterface } from "./PostDatabaseInterface";
import { CommentDatabaseInterface } from "./CommentDatabaseInterface";
import { z } from "zod";

// PATTERN: Facade, Strategy
/* DATABASEINTERBASE DECLARATION */
export const DatabaseInterface = UserDatabaseInterface
  .merge(CourseDatabaseInterface)
  .merge(AnnouncementDatabaseInterface)
  .merge(AssignmentDatabaseInterface)
  .merge(PostDatabaseInterface)
  .merge(CommentDatabaseInterface);

export type DatabaseInterface = z.infer<typeof DatabaseInterface>
/* DATABASE QUERY IMPLEMENTATIONS */
// const FakeDatabaseAccessor = {
//   ...FakeAnnouncementDatabaseAccessor,
//   ...FakeUserDatabaseAccessor,
//   ...FakeCourseDatabaseAccessor,
//   ...FakeAssignmentDatabaseAccessor,
// };

// export default FakeDatabaseAccessor;
