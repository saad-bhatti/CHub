import Surreal from "surrealdb.js";
import { z } from "zod";
import { PostFavoriteValidator } from "../../../utils/types/Post";
import { PostDatabaseInterface, PostDatabaseInterfaceMethods as methods } from "../../interface/PostDatabaseInterface";
import { RecordAsComment, SurrealComment } from "../schemas/Comments";
import { PostAsRecord, RecordAsPost, SurrealPost } from "../schemas/Posts";
import { CommentTable, getRecord, PostTable } from "../utils";

const getPostRecord = (id: string) => getRecord(PostTable, id);

export const SurrealPostInterface: (
  conn: Surreal
) => z.infer<typeof PostDatabaseInterface> = (conn) => {
  const getPost = methods.getPost.strictImplement(async (id) => {
    try {
      return {
        success: true,
        data: RecordAsPost(
          SurrealPost.parse((await conn.select(getPostRecord(id)))[0])
        ),
      };
    } catch (e) {
      return {
        success: true,
        data: null,
      };
    }
  });
  return PostDatabaseInterface.parse({
    getPost: getPost,
    getPostComments: methods.getPostComments.strictImplement(async (id) => {
      try {
        const res = await conn.query(
          `select * from ${CommentTable} where postId = ${getRecord(
            PostTable,
            id
          )}`
        );
        return {
          success: true,
          data: SurrealComment.array()
            .parse(res[0].result)
            .map(RecordAsComment),
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
    editPost: methods.editPost.strictImplement(async (id, info) => {
      try {
        const post = await getPost(id);
        if(!post.success) return post;
        if(!post.data) return {
          success: false,
          error: {
            error: "NotFound",
            message: `Post ${id} not found`
          }
        }
        post.data.update(info);
        await conn.update(getPostRecord(id), PostAsRecord(post.data));
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
    addPost: methods.addPost.strictImplement(async (post) => {
      try {
        await conn.create(getPostRecord(post.id), PostAsRecord(post));
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
    deletePost: methods.deletePost.implement(async (id) => {
      try {
        await conn.delete(getPostRecord(id));
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
