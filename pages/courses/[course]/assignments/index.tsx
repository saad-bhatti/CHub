import { Button, Card, Container, Row } from "react-bootstrap";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { AuthedPage } from "components/types";
import Loading from "components/Loading";
import CoursePage from "components/CoursePage";
import { trpc } from "utils/trpc";
import Link from 'next/link'

export const getServerSideProps = GSSPCoursePath;

const Assignments: AuthedPage<
  InferGetServerSidePropsType<typeof GSSPCoursePath>
> = ({ course, session: { user } }) => {
  const query = trpc.useQuery(["course.assignments", course]);
  if (query.data === undefined || query.data === null)
    return (
      <Container className="text-center pt-5">
        <Loading />
      </Container>
    );

  return (
    <Container className="text-center pt-5">
      <>
        {CoursePage({pathname: './', query: {course}})}
        <Card style={{ margin: "2rem", marginLeft: "3rem", width: "94.5%" }}>
          <h4 className="text-center" style={{ margin: "1rem" }}>
            Assignments
          </h4>
        </Card>

        {user.type == "Teacher" && (
          <Link href={{
            pathname: 'assignments/add'
          }}>
            <Button
              variant="primary"
            >
              Create new assignment
            </Button>
          </Link>
        )}
        <Row
          className="row row-cols-1 row-cols-md-3 g-4 mb-5"
          style={{ margin: "2rem" }}>
          {query.data.map((assignment) => {
            return (
              <Card
                className="p-3"
                key={assignment.id}
                style={{ margin: "1rem" }}
              >
                <h5 className="card-title">{assignment.title}</h5>
                <h6 className="card-subtitle mb-3 text-muted">
                  <>Due date: {assignment.dueDate.toUTCString()}</>
                </h6>
                <Link href={{
                  pathname: './assignments/[assignmentId]',
                  query: {
                    course: course,
                    assignmentId: assignment.id,
                  }
                }}>
                  <Button
                    variant="outline-primary"
                    className="mx-3"
                  >
                    Go to assignment page
                  </Button>
                </Link>
              </Card>
            );
          })}
        </Row>
      </>
    </Container>
  );
};

Assignments.auth = true;
export default Assignments;
