import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { AuthedPage } from "components/types";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, Form } from "react-bootstrap";
import { useQueryClient } from "react-query";
import {
  createTextAreaInput,
  createTextInput
} from "utils/forms/CreateForm";
import useForm from "utils/forms/FormValidator";
import { trpc } from "utils/trpc";
import {
  AnnouncementContentValidator,
  AnnouncementMutableInputValidator,
  AnnouncementTitleValidator
} from "utils/types/Announcement";
import { CourseCodeValidator } from "utils/types/Course";
import { z } from "zod";

export const getServerSideProps = GSSPCoursePath;
const CreateAnn: AuthedPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ course, session: { user } }) => {
  const router = useRouter();
  const addAnnouncement = trpc.useMutation(["announcement.add"], {
    onSuccess: () => queryClient.invalidateQueries(["course.announcements"]),
  });
  const queryClient = useQueryClient();
  const Editables = AnnouncementMutableInputValidator.omit({
    comments: true,
  });

  const [data, setData, validator] = useForm<z.infer<typeof Editables>>({
    title: {
      validator: AnnouncementTitleValidator,
    },
    content: {
      validator: AnnouncementContentValidator,
    },
  });

  function submit() {
    for (const key in data) data[key as keyof typeof data].touched = true;
    if (!validator()) return;

    addAnnouncement.mutate(
      {
        title: data.title.ref.current!.value,
        content: data.content.ref.current!.value,
        instructor: user.id,
        date: new Date(),
        courseCode: course,
        comments: [],
        announcementID: Math.random().toString(16).slice(2),
      },
      {
        onSuccess: (result, variable, context) => {
          router.push({
            pathname: "./",
            query: { course },
          });
        },
        onError(err) {
          console.log(err);
        },
      }
    );
  }
  return (
    <Card style={{ margin: "2rem" }}>
      <h4 className="text-center" style={{ margin: "1rem" }}>
        Create a New Announcement
      </h4>
      <Form>
        {createTextInput(data, "Title", "title", validator)}
        {createTextAreaInput(data, "Details", "content", validator, 9)}
        <Form.Check className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            style={{ margin: "0.5rem" }}
            onClick={submit}
          >
            Create
          </Button>
          <Link
            href={{
              pathname: './',
              query: {course: course}
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

CreateAnn.auth = true;
CreateAnn.role = "Teacher";

export default CreateAnn;
