import { Button, Container, Row, Card } from "react-bootstrap";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { AuthedPage } from "components/types";
import { trpc } from "utils/trpc";
import Loading from "components/Loading";
import CoursePage from "components/CoursePage";
import Link from "next/link";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import GenericError from "components/GenericError";

export const getServerSideProps = GSSPCoursePath;
const EnrolledStudents: AuthedPage<
  InferGetServerSidePropsType<typeof GSSPCoursePath>
> = ({ course, session: { user } }) => {
  // Route to different pages
  const router = useRouter();
  const enrolled = trpc.useQuery(["course.users", course]);

  if (enrolled.data === undefined)
    return (
      <Container className="text-center pt-5">
        {CoursePage({pathname: './', query: {course}})}
        <Loading />
      </Container>
    );

  if(enrolled.data === null) return GenericError("An error has occured please try again later.")

  return (
    <Container>
      {CoursePage({pathname: './', query: {course}})}
      <Card style={{ margin: "2rem", marginLeft: "3rem", width: "94.5%" }}>
        <h4 className="text-center" style={{ margin: "1rem" }}>
          Enrolled Student
        </h4>
      </Card>

      <Row
        className="row row-cols-1 row-cols-md-1 g-4 mb-5"
        style={{ margin: "2rem" }}
      >
        {enrolled.data.map((users) => {
          return (
            <Card className="p-3" key={users.id} style={{ margin: "1rem" }}>
              <Card.Header>userId: {users.id} </Card.Header>
              <h5 className="card-title">username: {users.username}</h5>
              <h5 className="card-title">email: {users.email}</h5>
              <h6 className="card-subtitle mb-3 text-muted">
                <>{users.type}</>
              </h6>
            </Card>
          );
        })}
      </Row>
    </Container>
  );
};

EnrolledStudents.auth = true;
EnrolledStudents.role = "Teacher";
export default EnrolledStudents;
