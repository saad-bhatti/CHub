import GenericError from "components/GenericError";
import Loading from "components/Loading";
import { GSSPUrlParams } from "components/props/GSSPUrlParam";
import { AuthedPage } from "components/types";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Button, Card, Form } from "react-bootstrap";
import { useQueryClient } from "react-query";
import { createTextAreaInput } from "utils/forms/CreateForm";
import useForm from "utils/forms/FormValidator";
import { trpc } from "utils/trpc";
import { CourseCodeValidator } from "utils/types/Course";
import { PostIdValidator } from "utils/types/Post";
import {
  PostCommentContentValidator,
  PostCommentIdValidator,
  PostCommentMutableInputValidator
} from "utils/types/PostComment";
import { z } from "zod";

export const getServerSideProps = GSSPUrlParams({course: CourseCodeValidator, commentId: PostCommentIdValidator, postId: PostIdValidator});
const EditComment: AuthedPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ commentId: comment, course, postId: post }) => {
  const router = useRouter();
  const commentQuery = trpc.useQuery(["postComment.get", comment]);
  const edit = trpc.useMutation(["postComment.edit"], {
    onSuccess: () => queryClient.invalidateQueries(["postComment.get"]),
  });
  const queryClient = useQueryClient();
  const Editables = PostCommentMutableInputValidator.omit({
    resolved: true,
    endorsement: true,
    pinned: true,
  });

  const [data, setData, validator] = useForm<z.infer<typeof Editables>>({
    content: {
      validator: PostCommentContentValidator,
    },
  });

  function submit() {
    for (const key in data) data[key as keyof typeof data].touched = true;
    if (
      !validator() ||
      commentQuery.data === undefined ||
      commentQuery.data === null
    )
      return;
    edit.mutate(
      {
        id: comment,
        newPostComment: {
          content: data.content.ref.current!.value,
          resolved: commentQuery.data.resolved,
          endorsement: commentQuery.data.endorsement,
          pinned: commentQuery.data.pinned,
        },
      },
      {
        onSuccess: (result, variable, context) => {
          router.push({
            pathname: `../../${post}`,
            query: { course: course },
          });
        },
      }
    );
  }

  if (commentQuery.data === undefined) return <Loading />;
  if (commentQuery.data === null) return GenericError("Could not find comment query.")

  return (
    <Card style={{ margin: "2rem" }}>
      <h4 className="text-center" style={{ margin: "1rem" }}>
        Edit Comment
      </h4>
      <Form>
        <Form.Group className="form-group" style={{ margin: "1rem" }}>
          <Form.Label className="text-primary">Previous Comment:</Form.Label>
          <Form.Label className="text-secondary">
            {commentQuery.data.content}
          </Form.Label>
        </Form.Group>
        {createTextAreaInput(data, "Content", "content", validator, 4)}
        <Form.Check className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            style={{ margin: "0.5rem" }}
            onClick={submit}
          >
            Edit
          </Button>
        </Form.Check>
      </Form>
    </Card>
  );
};

EditComment.auth = true;

export default EditComment;
