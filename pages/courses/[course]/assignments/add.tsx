import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { AuthedPage } from "components/types";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, Form } from "react-bootstrap";
import { useQueryClient } from "react-query";
import {
  createDateInput,
  createNumberInput,
  createTextInput
} from "utils/forms/CreateForm";
import useForm from "utils/forms/FormValidator";
import { trpc } from "utils/trpc";
import {
  AssignmentDueDateValidator, AssignmentMutableInputValidator,
  AssignmentTitleValidator,
  AssignmentWeightValidator
} from "utils/types/Assignment";
import { z } from "zod";

export const getServerSideProps = GSSPCoursePath;
const CreateAss: AuthedPage<
  InferGetServerSidePropsType<typeof GSSPCoursePath>
> = ({ course, session: { user } }) => {
  const router = useRouter();
  const newAss = trpc.useMutation(["assignment.add"], {
    onSuccess: () => queryClient.invalidateQueries("course.assignment"),
  });
  const queryClient = useQueryClient();
  const Editables = AssignmentMutableInputValidator.omit({
    files: true,
    grades: true,
    comments: true,
    regrade: true,
  });

  const [data, setData, validator] = useForm<z.infer<typeof Editables>>({
    title: {
      validator: AssignmentTitleValidator,
    },
    dueDate: {
      initialValue: new Date(),
      validator: AssignmentDueDateValidator,
    },
    weight: {
      initialValue: 0,
      validator: z.preprocess(
        (u) => parseInt(u as string),
        AssignmentWeightValidator
      ),
    },
  });

  function handle() {
    for (const key in data) data[key as keyof typeof data].touched = true;
    if (!validator()) return;
    var d = data.dueDate.ref.current!.valueAsDate!;
    d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
    newAss.mutate(
      {
        title: data.title.ref.current!.value,
        dueDate: d,
        weight: data.weight.ref.current!.valueAsNumber,
        id: course + data.title.ref.current!.value,
        courseCode: course,
        files: new Set(),
        grades: {},
        comments: {},
        regrade: {},
      },
      {
        onSuccess: (result, variable, context) => {
          router.push({
            pathname: "assignments",
            query: { course },
          });
        },
      }
    );
  }
  return (
    <Card style={{ margin: "2rem" }}>
      <h4 className="text-center" style={{ margin: "1rem" }}>
        Create a New Assignment
      </h4>
      <Form>
        {createTextInput(data, "Title", "title", validator)}
        {createDateInput(data, "Due date", "dueDate", validator)}
        {createNumberInput(data, "Weight", "weight", validator)}
        <Form.Check className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            style={{ margin: "0.5rem" }}
            onClick={handle}
          >
            Create
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
CreateAss.auth = true;
CreateAss.role = "Teacher";
export default CreateAss;
