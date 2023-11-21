import { useRouter } from "next/router";
import { Button, Container, Form } from "react-bootstrap";
import { trpc } from "utils/trpc";
import { z } from "zod";
import { AuthedPage } from "components/types";
import { createBoolInput, createTextInput } from "utils/forms/CreateForm";
import useForm from "utils/forms/FormValidator";
import {
  CourseCodeValidator,
  CourseInputValidator, LocationValidator,
  SemesterValidator,
  StatusValidator
} from "utils/types/Course";

const AddCourse: AuthedPage = ({ session: { user } }) => {
  const addCourse = trpc.useMutation(["course.add"]);
  const router = useRouter();

  const Editables = CourseInputValidator.omit({
    people: true,
    instructors: true,
  });

  const [data, setData, validator] = useForm<z.infer<typeof Editables>>({
    status: {
      initialValue: false,
      validator: z.preprocess((inp: unknown) => inp === "on", StatusValidator),
    },
    semester: {
      validator: SemesterValidator,
    },
    courseCode: {
      validator: CourseCodeValidator,
    },
    location: {
      validator: LocationValidator,
    },
  });

  function submit() {
    for (const key in data) data[key as keyof typeof data].touched = true;
    if (!validator()) return;

    addCourse.mutate(
      {
        status: data.status.ref.current!.checked,
        semester: data.semester.ref.current!.value,
        courseCode: data.courseCode.ref.current!.value,
        location: data.location.ref.current!.value,
        people: [],
        instructors: [user.id],
      },
      {
        onSuccess: (result, variable, context) => {
          router.push({
            pathname: './[courses]/code',
            query: {code: data.courseCode.ref.current!.value}
          });
        },
        onError(err) {
          console.log(err);
        },
      }
    );
  }

  return (
    <Container>
      <Form>
        {createTextInput(data, "Course code", "courseCode", validator)}
        {createTextInput(data, "Semester", "semester", validator)}
        {createTextInput(data, "Location", "location", validator)}
        {createBoolInput(data, "Active?", "status", validator)}

        <Button onClick={submit}>Submit</Button>
      </Form>
    </Container>
  );
};
AddCourse.auth = true;
AddCourse.role = "Teacher";
export default AddCourse;
