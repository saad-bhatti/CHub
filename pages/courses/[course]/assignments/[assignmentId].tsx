import { Alert, Button, Container, Row, Col, Card, Accordion} from "react-bootstrap";
import { useState } from "react";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { AuthedPage } from "components/types";
import { trpc } from "utils/trpc";
import Loading from "components/Loading";
import { useQueryClient } from "react-query";
import Link from "next/link";
import GSSPUrlParam from "components/props/GSSPUrlParam";
import { CourseCodeValidator } from "utils/types/Course";
import { AssignmentIDValidator } from "utils/types/Assignment";
import GenericError from "components/GenericError";

export const getServerSideProps = GSSPUrlParam({course: CourseCodeValidator, assignmentId: AssignmentIDValidator});

const Assignments: AuthedPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ course, assignmentId, session: { user } }) => {
  const toggleRegrade = () => {
    request.mutate({ assgId: assignmentId });
  };

  // Route to different pages
  const queryClient = useQueryClient();

  // Do the query and get related data
  const enrolled = trpc.useQuery(["course.users", course]);
  const assignment = trpc.useQuery(["assignment.get", assignmentId]);
  const average = trpc.useQuery(["assignment.average", assignmentId]);

  const content = trpc.useQuery([
    "assignment.content",
    { assgId: assignmentId, studentId: user.id },
  ]);

  const request = trpc.useMutation(["assignment.toggleRegrade"], {
    onSuccess: () => {
      queryClient.invalidateQueries([
        "assignment.grade",
        { assgId: assignmentId, studentId: user.id },
      ]);
      queryClient.invalidateQueries(["assignment.get", assignmentId]);
    },
  });
  const grade = trpc.useQuery([
    "assignment.grade",
    { assgId: assignmentId, studentId: user.id },
  ]);
  const comment = trpc.useQuery([
    "assignment.comment",
    { assgId: assignmentId, studentId: user.id },
  ]);

  const backButton = (
    <Row className="mb-3">
      <Link
        href={{
          pathname: '../',
          query: {
            course: course
          }
        }}>
        <Button
          className="w-auto"
          variant="outline-primary"
        >
          Go back to {course} assignment list
        </Button>
      </Link>
    </Row>
  );

  if (assignment.data === undefined || enrolled.data === undefined || average.data === undefined){
    return (
      <Container className="text-center pt-5">
        {backButton}
        <Loading />
      </Container>
    );
  }

  if (assignment.data === null){
    return (
      <Container className="text-center pt-5">
        {backButton}
        {GenericError("This assignment does not exist, please go to an existing assignment.")}
      </Container>)
  }

  if (enrolled.data === null){
    return (
      <Container className="text-center pt-5">
        {backButton}
        {GenericError("Could not find students in this course. Please select a course with students.")}
      </Container>)
  }
  if (average.data === null){
    return (
      <Container className="text-center pt-5">
        {backButton}
        {GenericError("Average data could not be found for this course.")}
      </Container>)
  }
    

  // 'regradeId' This is the id sorted (Ungraded, Regrade, Graded, No Submission)
  // 'gradedId' This is all the user id have received grade
  // 'ungradedId' This is all the user id have not received a grade
  // 'noSubmission' This is the list of user id with no submission
  let regradeId:any[] = [];
  let gradedId:any[] = [];
  var userGrade:any = {}
  let ungradedId:any[] = [];
  let noSubmission:any[] = [];

  // Get all the user profiles
  enrolled.data?.map((user) => {
    // Get all the regrade
    if (assignment.data!.regrade.has(user.id)){
      regradeId.push(user);
      userGrade[user.id] = assignment.data!.grades[user.id].toString();
      // Get all the grades
    } else if (assignment.data!.grades[user.id] !== undefined){
      gradedId.push(user);
      userGrade[user.id] = assignment.data!.grades[user.id].toString();
      // Get all the ungraded
    } else if (assignment.data!.files.has(user.id) && (assignment.data!.grades[user.id] === undefined)){
      ungradedId.push(user);
      // Get all the no Submission files
    } else {
      noSubmission.push(user);
    }
  })


  return (
    <Container>
      <Container className="text-center pt-5">
        {backButton}
        <div
          className="row"
          style={{
            justifyContent: "space-between",
            flexDirection: "row-reverse",
          }}
        >
          {user.type === "Student" && grade.data != null && (
            <Button
              variant="primary float-end"
              className="mx-3"
              style={{ width: "fit-content", justifySelf: "right" }}
              onClick={toggleRegrade}
            >
              {!assignment.data.regrade.has(user.id) ? "Request regrade" : "Cancel request"}
            </Button>
          )}
        </div>
        <h1>{assignment.data.title}</h1>
        <h4 className="mb-5">
          <>Due: {assignment.data.dueDate.toUTCString()}</>
        </h4>
      </Container>
      <Container>
        {user.type === "Student" ? (
          <>
            {new Date(assignment.data.dueDate) > new Date() ? (
              <Link href={{
                pathname: "[assignmentId]/upload",
                query: {
                  course: course,
                  assignmentId: assignment.data.id
                }
              }}>
                <Button>
                  Add files for this assignment
                </Button>
              </Link>
            ) : (
              <Alert variant="danger">
                The due date has passed, no more submissions allowed.
              </Alert>
            )}

            {content.data !== null ? (
              <>
                <Card className="m-3" style={{ top: "0.5rem" }}>
                  <Card.Header>
                    <Card.Title>Student no: {user.id}</Card.Title>
                    {grade.data != null && (
                      <Card.Subtitle className="mb-2 text-end">
                        Assignment Graded: {grade.data}{" "}
                        {average.data > 0 && `(The average is ${Math.round(average.data *100)/100})`}{" "}
                      </Card.Subtitle>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                      {content.data}
                    </Card.Text>
                  </Card.Body>
                </Card>

                {comment.data !== null && (
                  <Card className="m-3" style={{ top: "0.5rem" }}>
                    <Card.Header className="text-center">
                      <Card.Title>Instructor Comment</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                        {comment.data}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                )}
              </>
            ) : (
              <></>
            )}
          </>
        ) : ( // Teacher Section

        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Ungraded Assignment ({ungradedId.length} Students) </Accordion.Header>
            <Accordion.Body>
              <Row
                className="row row-cols-1 row-cols-md-3 g-4 mb-5"
                style={{ margin: "2rem" }}>
                  {ungradedId.map((users:any) => {
                    return (
                      <Card className="p-3" key={users.id} style={{ margin: "1rem" }}>
                        <Row>
                          <Col>
                            <h5 className="mb-3 card-title">Username: {users.username}</h5>
                          </Col>
                        </Row>
                        <h6 className="card-subtitle mb-3 text-muted">
                          <>userId: {users.id}</>
                        </h6>
                        <Link href={{
                          pathname: "./[assignmentId]/[user]",
                          query: {
                            course: course,
                            assignmentId: assignmentId,
                            user: users.id
                          }
                        }}>
                          <Button
                            variant="primary"
                            className="mx-3"
                            >
                            Grade Assignment
                          </Button>
                        </Link>
                      </Card>
                    );
                  })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Regrade Request ({regradeId.length} Students) </Accordion.Header>
            <Accordion.Body>
              <Row
                className="row row-cols-1 row-cols-md-3 g-4 mb-5"
                style={{ margin: "2rem" }}>
                  {regradeId.map((users:any) => {
                    return (
                      <Card className="p-3" key={users.id} style={{ margin: "1rem" }}>
                        <Row>
                          <Col>
                            <h5 className="mb-3 card-title">Username: {users.username}</h5>
                          </Col>
                          <Col>
                            <h6 className="mb-3 text-muted text-end">Grade: {userGrade[users.id]}</h6>
                          </Col>
                        </Row>
                        <h6 className="card-subtitle mb-3 text-muted">
                          <>userId: {users.id}</>
                        </h6>
                        <Link href={{
                          pathname: "./[assignmentId]/[user]",
                          query: {
                            course: course,
                            assignmentId: assignmentId,
                            user: users.id
                          }
                        }}>
                          <Button
                            variant="primary"
                            className="mx-3"
                            >
                            Regrade Assignment
                          </Button>
                        </Link>
                      </Card>
                    );
                  })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Graded Assignment ({gradedId.length} Students)</Accordion.Header>
            <Accordion.Body>
              <Row
                className="row row-cols-1 row-cols-md-3 g-4 mb-5"
                style={{ margin: "2rem" }}>
                {gradedId.map((users:any) => {
                  return (
                    <Card className="p-3" key={users.id} style={{ margin: "1rem" }}>
                      <Row>
                        <Col>
                          <h5 className="card-title mb-3">Username: {users.username}</h5>
                        </Col>
                        <Col>
                          <h6 className="mb-3 text-muted text-end">Grade: {userGrade[users.id]}</h6>
                        </Col>
                      </Row>
                      <h6 className="card-subtitle mb-3 text-muted">
                        <>userId: {users.id}</>
                      </h6>
                      <Link href={{
                          pathname: "./[assignmentId]/[user]",
                          query: {
                            course: course,
                            assignmentId: assignmentId,
                            user: users.id
                          }
                        }}>
                          <Button
                            variant="primary"
                            className="mx-3"
                            >
                            Change grade
                          </Button>
                        </Link>
                    </Card>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="3">
            <Accordion.Header>No Submission ({noSubmission.length} Students)</Accordion.Header>
            <Accordion.Body>
              <Row
                className="row row-cols-1 row-cols-md-3 g-4 mb-5"
                style={{ margin: "2rem" }}>
                  {noSubmission.map((users:any) => {
                    return (
                      <Card className="p-3" key={users.id} style={{ margin: "1rem" }}>
                        <Row>
                          <Col>
                            <h5 className="card-title mb-3">Username: {users.username}</h5>
                          </Col>
                        </Row>
                        <h6 className="card-subtitle mb-3 text-muted">
                          <>userId: {users.id}</>
                        </h6>
                        <Link href={{
                          pathname: "./[assignmentId]/[user]",
                          query: {
                            course: course,
                            assignmentId: assignmentId,
                            user: users.id
                          }
                        }}>
                          <Button
                            variant="primary"
                            className="mx-3"
                            >
                            Grade Assignment
                          </Button>
                        </Link>
                      </Card>
                    );
                  })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        )}
      </Container>
    </Container>
  );
};

Assignments.auth = true;
export default Assignments;
