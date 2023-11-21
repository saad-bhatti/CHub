import GenericError from "components/GenericError";
import GSSPUrlParams from "components/props/GSSPUrlParam";
import { AuthedPage } from "components/types";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Button, Card, Form } from "react-bootstrap";
import { useQueryClient } from "react-query";
import {
  createSelectInput, createTextAreaInput,
  createTextInput
} from "utils/forms/CreateForm";
import useForm from "utils/forms/FormValidator";
import { trpc } from "utils/trpc";
import { CourseCodeValidator } from "utils/types/Course";
import {
  PostContentValidator,
  PostIdValidator,
  PostMutableInputValidator,
  PostTitleValidator,
  PostTypeValidator
} from "utils/types/Post";
import { z } from "zod";
import Loading from "components/Loading";

export const getServerSideProps = GSSPUrlParams({post: PostIdValidator, course: CourseCodeValidator});
const EditPost: AuthedPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ post: id, course }) => {
  const router = useRouter();
  const postQuery = trpc.useQuery(["post.get", id]);
  const edit = trpc.useMutation(["post.edit"], {
    onSuccess: () => queryClient.invalidateQueries(["post.get"]),
  });
  const queryClient = useQueryClient();
  const Editables = PostMutableInputValidator.omit({
    endorsement: true,
    likes: true,
    pinned: true,
    favorite: true,
  });

  const [data, setData, validator] = useForm<z.infer<typeof Editables>>({
    title: {
      initialValue: postQuery.data?.title || "",
      validator: PostTitleValidator,
    },
    content: {
      initialValue: postQuery.data?.content || "",
      validator: PostContentValidator,
    },
    type: {
      initialValue: "Question",
      validator: PostTypeValidator,
    },
  });

  if (postQuery.data === undefined || postQuery.data === null) {
    return <Loading />;
  }
  if (postQuery.data === null) return GenericError("Could not find post.")

  function submit() {
    for (const key in data) data[key as keyof typeof data].touched = true;
    if (!validator() || postQuery.data === undefined || postQuery.data === null)
      return;
    edit.mutate(
      {
        id: id,
        newPost: {
          title: data.title.ref.current!.value,
          content: data.content.ref.current!.value,
          type: data.type.ref.current!.value as z.infer<
            typeof PostTypeValidator
          >,
          endorsement: postQuery.data.endorsement,
          likes: postQuery.data.likes,
          pinned: postQuery.data.pinned,
          favorite: postQuery.data.favorite,
        },
      },
      {
        onSuccess: (result, variable, context) => {
          router.push({
            pathname: `../${id}`,
            query: { course: course },
          });
        },
      }
    );
  }
  return (
    <Card style={{ margin: "2rem" }}>
      <h4 className="text-center" style={{ margin: "1rem" }}>
        Edit Post
      </h4>
      <Form>
        {createSelectInput(data, "Post type", "type", validator, [
          "Question",
          "Comment",
        ])}
        {createTextInput(data, "Title", "title", validator)}
        {createTextAreaInput(data, "Content", "content", validator, 9)}
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

EditPost.auth = true;

export default EditPost;
