import { Form, Button, Card } from "react-bootstrap";
import { useRouter } from "next/router";
import { z } from "zod";
import { trpc } from "utils/trpc";
import { useQueryClient } from "react-query";
import { InferGetServerSidePropsType, NextPage } from "next";
import { RefObject, useRef, useState } from "react";
import { InputValidator } from "utils/forms/InputValidators";
import { AuthedPage } from "components/types";
import useForm from "utils/forms/FormValidator";
import {
  PostCommentContentValidator,
  PostCommentMutableInputValidator,
} from "utils/types/PostComment";
import { createTextAreaInput } from "utils/forms/CreateForm";
import GSSPUrlParam from "components/props/GSSPUrlParam";
import { CourseCodeValidator } from "utils/types/Course";
import { PostIdValidator } from "utils/types/Post";

export const getServerSideProps = GSSPUrlParam({course: CourseCodeValidator, postId: PostIdValidator});
const AddComment: AuthedPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ postId, course, session: { user } }) => {
  const router = useRouter();
  const add = trpc.useMutation(["postComment.add"], {
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
    if (!validator()) return;
    add.mutate(
      {
        content: data.content.ref.current!.value,
        endorsement: false,
        pinned: false,
        resolved: false,
        ownerId: user.id,
        postId: postId,
        id: Math.random().toString(16).slice(2),
        date: new Date(),
      },
      {
        onSuccess: (result, variable, context) => {
          router.push({pathname: `../[postId]`, query: {
            course,
            postId
          }});
        },
      }
    );
  }
  return (
    <Card style={{ margin: "2rem" }}>
      <h4 className="text-center" style={{ margin: "1rem" }}>
        Add a Comment
      </h4>
      <Form>
        {createTextAreaInput(data, "Content", "content", validator, 9)}
        <Form.Check className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            style={{ margin: "0.5rem" }}
            onClick={submit}
          >
            Add
          </Button>
        </Form.Check>
      </Form>
    </Card>
  );
};

AddComment.auth = true;

export default AddComment;
