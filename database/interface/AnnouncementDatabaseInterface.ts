import { z } from "zod";
import {
  AnnouncementIDValidator,
  AnnouncementMutableInputValidator,
  AnnouncementValidator,
} from "../../utils/types/Announcement";
//import database from "../FakeDatabase";
import {
  DatabaseResponseValidator,
  EmptyDatabaseResponseValidator,
} from "../types";

const addAnnouncement = z
  .function()
  .args(AnnouncementValidator)
  .returns(EmptyDatabaseResponseValidator);

const getAnnouncement = z
  .function()
  .args(AnnouncementIDValidator)
  .returns(DatabaseResponseValidator(AnnouncementValidator.nullable()));

const deleteAnnouncement = z
  .function()
  .args(AnnouncementIDValidator)
  .returns(EmptyDatabaseResponseValidator);

const editAnnouncement = z
  .function()
  .args(AnnouncementIDValidator, AnnouncementMutableInputValidator)
  .returns(EmptyDatabaseResponseValidator);

export const AnnouncementDatabaseInterfaceMethods = {
  addAnnouncement: addAnnouncement,
  getAnnouncement: getAnnouncement,
  deleteAnnouncement: deleteAnnouncement,
  editAnnouncement: editAnnouncement,
};
export const AnnouncementDatabaseInterface = z.object(AnnouncementDatabaseInterfaceMethods);
export type AnnouncementDatabaseInterface = z.infer<typeof AnnouncementDatabaseInterface>
// export const FakeAnnouncementDatabaseAccessor: z.infer<
//   typeof AnnouncementDatabaseInterface
// > = {
//   getAnnouncement: getAnnouncement.implement(async (ID) => {
//     return Promise.resolve({
//       success: true,
//       data:
//         database.announcements.filter((a) => a.announcementID === ID).at(0) ||
//         null,
//     });
//   }),
//   // Mutations
//   addAnnouncement: addAnnouncement.implement((announcement) => {
//     database.announcements.push(announcement);
//     return Promise.resolve({ success: true });
//   }),
//   editAnnouncement: editAnnouncement.implement((ID, announcement) => {
//     database.announcements = database.announcements.map(
//       (databaseAnnouncement) => {
//         if (databaseAnnouncement.announcementID === ID)
//           databaseAnnouncement.update(announcement);
//         return databaseAnnouncement;
//       }
//     );

//     return Promise.resolve({ success: true });
//   }),
//   deleteAnnouncement: deleteAnnouncement.implement((ID) => {
//     database.announcements = database.announcements.filter(
//       (a) => a.announcementID !== ID
//     );
//     return Promise.resolve({ success: true });
//   }),
// };
