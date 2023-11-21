import GenericError from "components/GenericError";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { AuthedPage } from "components/types";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, Form } from "react-bootstrap";
import { useQueryClient } from "react-query";
import {
  createBoolInput,
  createTextInput
} from "utils/forms/CreateForm";
import useForm from "utils/forms/FormValidator";
import { trpc } from "utils/trpc";
import {
  CourseMutableInputValidator,
  LocationValidator,
  StatusValidator
} from "utils/types/Course";
import { z } from "zod";
import Loading from "components/Loading";

export const getServerSideProps = GSSPCoursePath;
const EditCourse: AuthedPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ course }) => {
  const router = useRouter();
  const courseQuery = trpc.useQuery(["course.get", course]);
  const edit = trpc.useMutation(["course.update"], {
    onSuccess: () => queryClient.invalidateQueries(["course.get"]),
  });
  const queryClient = useQueryClient();
  const Editables = CourseMutableInputValidator.omit({
    people: true,
    instructors: true,
    courseCode: true,
    semester: true,
  });

  const [data, setData, validator] = useForm<z.infer<typeof Editables>>({
    location: {
      initialValue: courseQuery.data?.location || "",
      validator: LocationValidator,
    },
    status: {
      initialValue: courseQuery.data?.status && true,
      validator: StatusValidator,
    },
  });

  if (courseQuery.data === undefined || courseQuery.data === null) {
    return <Loading/>
  }

  if (courseQuery.data === null) return GenericError("Course data could not be found");

  function submit() {
    for (const key in data) data[key as keyof typeof data].touched = true;
    if (!validator()) return;
    edit.mutate(
      {
        code: course,
        newCourse: {
          people: courseQuery.data!.people,
          location: data.location.ref.current!.value,
          instructors: courseQuery.data!.instructors,
          status: data.status.ref.current!.checked,
        },
      },
      {
        onSuccess: (result, variable, context) => {
          router.push({
            pathname: './'
          });
        },
      }
    );
  }
  return (
    <Card style={{ margin: "2rem" }}>
      <h4 className="text-center" style={{ margin: "1rem" }}>
        Edit {course} Course Infomation
      </h4>
      <Form>
        {createTextInput(data, "Location", "location", validator)}
        {createBoolInput(data, "Active", "status", validator)}
        <Form.Check className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            style={{ margin: "0.5rem" }}
            onClick={submit}
          >
            Edit
          </Button>
          <Link
            href={{
              pathname: '../',
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

EditCourse.auth = true;
EditCourse.role = "Teacher";

export default EditCourse;
