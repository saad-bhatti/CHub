import { Form, Button, Card, FloatingLabel } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";
import { trpc } from "utils/trpc";
import { useQueryClient } from "react-query";
import { InferGetServerSidePropsType, NextPage } from "next";
import { RefObject, useRef, useState } from "react";
import { InputValidator } from "utils/forms/InputValidators";
import { AuthedPage } from "components/types";
import useForm from "utils/forms/FormValidator";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import {
  PostContentValidator,
  PostMutableInputValidator,
  PostTitleValidator,
  PostTypeValidator,
} from "utils/types/Post";
import {
  createSelectInput,
  createTextAreaInput,
  createTextInput,
} from "utils/forms/CreateForm";

export const getServerSideProps = GSSPCoursePath;
const AddPost: AuthedPage<
  InferGetServerSidePropsType<typeof GSSPCoursePath>
> = ({ course, session: { user } }) => {
  const router = useRouter();
  const add = trpc.useMutation(["post.add"], {
    onSuccess: () => queryClient.invalidateQueries(["course.posts"]),
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
      validator: PostTitleValidator,
    },
    content: {
      validator: PostContentValidator,
    },
    type: {
      initialValue: "Question",
      validator: PostTypeValidator,
    },
  });

  function submit() {
    for (const key in data) data[key as keyof typeof data].touched = true;
    if (!validator()) return;

    add.mutate(
      {
        title: data.title.ref.current!.value,
        content: data.content.ref.current!.value,
        type: data.type.ref.current!.value as z.infer<typeof PostTypeValidator>,
        course: course,
        id: Math.random().toString(16).slice(2),
        endorsement: false,
        likes: 0,
        owner: user.id,
        pinned: false,
        favorite: new Set(),
        date: new Date(),
      },
      {
        onSuccess: (result, variable, context) => {
          router.push({
            pathname: `./[postId]`,
            query: { course, postId: variable.id },
          });
        },
      }
    );
  }
  return (
    <Card style={{ margin: "2rem" }}>
      <h4 className="text-center" style={{ margin: "1rem" }}>
        Add a New Post
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
            Post
          </Button>
          <Link
            href={{
              pathname: "./",
              query: { course: course },
            }}
          >
            <Button variant="outline-dark" style={{ margin: "0.5rem" }}>
              Cancel
            </Button>
          </Link>
        </Form.Check>
      </Form>
    </Card>
  );
};

AddPost.auth = true;

export default AddPost;
