import { Card, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import { AuthedPage } from "components/types";
import { InferGetServerSidePropsType } from "next";
import GSSPUrlParam from "components/props/GSSPUrlParam";
import { CourseCodeValidator } from "utils/types/Course";
import { AssignmentIDValidator } from "utils/types/Assignment";

export const getServerSideProps = GSSPUrlParam({course: CourseCodeValidator, assignmentId: AssignmentIDValidator});

const UploadAssignment: AuthedPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ assignmentId: assignId, course, session: { user } }) => {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const assignment = {
    ID: "",
    content: "",
  };

  const uploadAssignment = trpc.useMutation(["assignment.upload"], {
    onSuccess: () => {
      queryClient.invalidateQueries(["assignment.get"]);
    },
  });

  function handle() {
    // check if the file is not null and it's type is text file
    if (file && file.name.match(".txt")) {
      // File reader handler
      var fileReader = new FileReader();

      // Reads a text file only
      fileReader.readAsText(file);
      fileReader.onload = function () {
        // Check the result is not null and is only of type of string
        if (
          fileReader.result == null ||
          fileReader.result instanceof ArrayBuffer
        ) {
          alert("Upload error occur please try again");
          return;
        }

        // Store assignment Id and content to the assignment
        assignment.ID = assignId;
        assignment.content = fileReader.result;

        // Send the upload file to backend
        uploadAssignment.mutate(assignment, {
          onSuccess: () => {
            router.push({
              pathname: '../',
              query: {
                course: course
              }
            });
          },
          onError(err) {
            console.log(err);
          },
        });
      };
      return;
    }
    alert("Upload file of type .txt");
    return;
  }

  return (
    <Card style={{ margin: "4rem" }}>
      <h4 className="text-center" style={{ margin: "1rem" }}>
        Upload Assignment
      </h4>
      <Form>
        <Form.Group className="mb-3" style={{ margin: "2rem" }}>
          <Form.Label className="text-primary">
            Upload Assignment file in a text format:
          </Form.Label>
          <Form.Control
            type="file"
            style={{ width: "75%" }}
            onChange={(e) => {
              setFile((e.target as HTMLInputElement).files![0]);
            }}
          />
        </Form.Group>
        <Form.Check className="d-flex justify-content-center">
          <Button
            variant="outline-primary"
            style={{ margin: "0.5rem" }}
            onClick={handle}
          >
            Submit
          </Button>
        </Form.Check>
      </Form>
    </Card>
  );
};

UploadAssignment.auth = true;
export default UploadAssignment;
