import Surreal from "surrealdb.js";
import { z } from "zod";
import { AnnouncementDatabaseInterface, AnnouncementDatabaseInterfaceMethods as methods } from "../../interface/AnnouncementDatabaseInterface";
import {
  AnnouncementAsRecord,
  MutableAnnouncementAsRecord,
  RecordAsAnnouncement,
  SurrealAnnouncement,
} from "../schemas/Announcements";
import { getRecord, AnnouncementTable } from "../utils";

const getAnnouncementRecord = (id: string) => getRecord(AnnouncementTable, id);
export const SurrealAnnoucementInterface: (
  conn: Surreal
) => z.infer<typeof AnnouncementDatabaseInterface> = (conn) => {
  const getAnnouncement = methods.getAnnouncement.strictImplement(async (id) => {
    try {
      return {
        success: true,
        data: RecordAsAnnouncement(
          SurrealAnnouncement.parse(
            (await conn.select(getAnnouncementRecord(id)))[0]
          )
        ),
      };
    } catch (e) {
      return {
        success: true,
        data: null,
      };
    }
  })
  return AnnouncementDatabaseInterface.parse({
    getAnnouncement: getAnnouncement,
    addAnnouncement: methods.addAnnouncement.strictImplement(async (course) => {
      try {
        await conn.create(
          getAnnouncementRecord(course.announcementID),
          AnnouncementAsRecord(course)
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
    editAnnouncement: methods.editAnnouncement.strictImplement(async (id, info) => {
      try {
        const announcement = await getAnnouncement(id);
        if(!announcement.success) return announcement;
        if(!announcement.data) return {
            success: false,
            error: {
              error: "NotFound",
              message: `Announcement '${id}' not found.`
            }
          }
        announcement.data.update(info)
        await conn.update(
          getAnnouncementRecord(id),
          AnnouncementAsRecord(announcement.data)
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
    deleteAnnouncement: methods.deleteAnnouncement.strictImplement(async (id) => {
      try {
        await conn.delete(getAnnouncementRecord(id));
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
