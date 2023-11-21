import { Form, Button, Card, Container } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { z } from "zod";
import { CourseCodeValidator } from "utils/types/Course";
import { AssignmentIDValidator } from "utils/types/Assignment";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { AuthedPage } from "components/types";
import { trpc } from "utils/trpc";
import React from "react";
import Loading from "components/Loading";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps<{
  course: string;
  assignment: string;
  user: string;
}> = async ({ params }) => {
  const course = CourseCodeValidator.safeParse(params?.course);
  if (!course.success) return { notFound: true };
  const assignment = AssignmentIDValidator.safeParse(params?.assignmentId);
  if (!assignment.success) return { notFound: true };
  const user = AssignmentIDValidator.safeParse(params?.user);
  if (!user.success) return { notFound: true };
  return {
    props: {
      course: course.data,
      assignment: assignment.data,
      user: user.data,
    },
  };
};

const DisplayFile: AuthedPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ course, assignment, user }) => {
  // Route the page to the correct URL
  const router = useRouter();
  const [grade, setGrade] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const queryClient = useQueryClient();

  // Dispaly assignment content
  const query = trpc.useQuery([
    "assignment.content",
    { assgId: assignment, studentId: user },
  ]);
  // Add assignment grades
  const addGrade = trpc.useMutation(["assignment.addGrade"], {
    onSuccess: () => {
      queryClient.invalidateQueries(["assignment.grade"]);
    },
  });
  // Add assignment comments
  const addComment = trpc.useMutation(["assignment.addComment"], {
    onSuccess: () => {
      queryClient.invalidateQueries(["assignment.comment"]);
    },
  });

  function submitGradeAndComment() {
    if (grade != "" && comment != "") {
      if (0 <= parseInt(grade) && parseInt(grade) < 101) {
        // Send grade to backend
        addGrade.mutate(
          {
            assgId: assignment,
            studentId: user,
            grade: parseInt(grade),
          },
          {
            onSuccess: () => {
              addComment.mutate(
                {
                  assgId: assignment,
                  studentId: user,
                  comment: comment,
                },
                {
                  onSuccess: () => {
                    router.push(`../`);
                  },
                }
              );
            },
            onError(err) {
              console.log(err);
            },
          }
        );
        return;
      }
      alert("Please make sure grade is within bound: 0 <= grade <= 100");
      return;
    }
    alert("Grade or comment section cannot be blank");
    return;
  }

  if (query.data === undefined) return <Loading />;

  // Display student assignment content
  const content = (
    <>
      <Card className="m-3">
        <Card.Header>
          <Card.Title>{course} {assignment}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">student id: {user}</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Card.Text style={{ whiteSpace: "pre-wrap" }}>{query.data}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );

  return (
    <Container>
      {content}
      <Card style={{ margin: "2rem" }}>
        <Card.Header>
          <h4 className="text-center" style={{ margin: "0.3rem" }}>
            Assignment Grade
          </h4>
        </Card.Header>
        <Form>
          <Form.Group className="mb-3" style={{ margin: "1rem" }}>
            <Form.Label className="text-primary">Mark Assignment:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add mark for this assignment"
              style={{ width: "50%" }}
              onChange={(e) => {
                setGrade(e.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="form-group" style={{ margin: "1rem" }}>
            <Form.Label className="text-primary">Comment:</Form.Label>
            <textarea
              className="form-control"
              placeholder="Comment on Student Assignment"
              rows={4}
              onChange={(e) => {
                setComment(e.target.value);
              }}
            ></textarea>
          </Form.Group>
        </Form>
      </Card>

      <Link
        href={{
          pathname: "../[assignmentid]",
          query: { course: course, assignmentid: assignment },
        }}
      >
        <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
          Cancel
        </Button>
      </Link>
      <Button
        variant="outline-primary"
        style={{ margin: "0.5rem" }}
        onClick={submitGradeAndComment}
      >
        Save
      </Button>
    </Container>
  );
};

DisplayFile.auth = true;
DisplayFile.role = "Teacher";
export default DisplayFile;
