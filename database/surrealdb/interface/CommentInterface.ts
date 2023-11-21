import Surreal from "surrealdb.js";
import { z } from "zod";
import { CommentDatabaseInterface, CommentDatabaseInterfaceMethods as methods } from "../../interface/CommentDatabaseInterface";
import {
  CommentAsRecord,
  MutableCommentAsRecord,
  RecordAsComment,
  SurrealComment,
} from "../schemas/Comments";
import { RecordAsPost, SurrealPost } from "../schemas/Posts";
import { CommentTable, getRecord } from "../utils";

const getCommentRecord = (id: string) => getRecord(CommentTable, id);

export const SurrealCommentInterface: (
  conn: Surreal
) => z.infer<typeof CommentDatabaseInterface> = (conn) => {
  const getComment = methods.getComment.strictImplement(async (id) => {
    try {
      return {
        success: true,
        data: RecordAsComment(
          SurrealComment.parse((await conn.select(getCommentRecord(id)))[0])
        ),
      };
    } catch (e) {
      return {
        success: true,
        data: null,
      };
    }
  });
  return CommentDatabaseInterface.parse({
    getComment: getComment,
    editComment: methods.editComment.strictImplement(async (id, info) => {
      try {
        const comment = await getComment(id);
        if(!comment.success) return comment;
        if(!comment.data) return {
          success: false,
          error: {
            error: "NotFound",
            message: `Comment ${id} not found.`
          }
        }
        comment.data.update(info);
        await conn.change(getCommentRecord(id), CommentAsRecord(comment.data));
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
    addComment: methods.addComment.strictImplement(async (comment) => {
      try {
        await conn.create(
          getCommentRecord(comment.id),
          CommentAsRecord(comment)
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
    deleteComment: methods.deleteComment.strictImplement(async (id) => {
      try {
        await conn.delete(getCommentRecord(id));
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
