import { Form, Button, Card } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthedPage } from "components/types";
import { InferGetServerSidePropsType } from "next";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { trpc } from "utils/trpc";
import { useState } from "react";
import { useQueryClient } from "react-query";

export const getServerSideProps = GSSPCoursePath;

const AddFile: AuthedPage<
  InferGetServerSidePropsType<typeof GSSPCoursePath>
> = ({ course }) => {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const uploadfile = trpc.useMutation(["course.uploadFile"], {
    onSuccess: () => queryClient.invalidateQueries(["assignment.get"]),
  });
  function handle() {
    if (!file) return;

    file.text().then((val) =>
      uploadfile.mutate(
        {
          code: course,
          fileName: file.name,
          fileContent: val,
        },
        {
          onSuccess: (result, variable, context) => {
            router.push({
              pathname: "[file]",
              query: { course: course, file: file.name },
            });
          },
          onError(err) {
            console.log(err);
          },
        }
      )
    );
  }
  return (
    <Card style={{ margin: "2rem" }}>
      <h4 className="text-center" style={{ margin: "1rem" }}>
        Add a File
      </h4>
      <Form>
        <Form.Group className="form-group" style={{ margin: "1rem" }}>
          <Form.Label className="text-primary">
            Select a File to Upload
          </Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => {
              const elem = e.target as HTMLInputElement;
              if (elem.files) setFile(elem.files[0]);
            }}
            accept=".txt"
            multiple={false}
          />
        </Form.Group>
        <Form.Check className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            onClick={handle}
            style={{ margin: "0.5rem" }}
          >
            Upload
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

AddFile.auth = true;
AddFile.role = "Teacher";
export default AddFile;
