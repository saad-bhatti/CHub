import { Button, Container, Row, Nav } from "react-bootstrap";
import { useRouter } from "next/router";
import { AuthedPage } from "components/types";
import { InferGetServerSidePropsType } from "next";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { trpc } from "../../../utils/trpc";
import Loading from "../../../components/Loading";
import Link from "next/link";
import GenericError from "components/GenericError";

export const getServerSideProps = GSSPCoursePath
const Course: AuthedPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ course, session: { user } }) => {
  const router = useRouter();
  const currentCourse = trpc.useQuery(["course.get", course]);

  const dashboard = (
    <Row className="mb-3" style={{ marginTop: "2.5rem" }}>
      <Button
        className="w-auto"
        variant="outline-primary"
        onClick={() => {
          router.push('./');
        }}
      >
        Back to Dashboard
      </Button>
    </Row>
  );

  if (currentCourse.data === undefined)
    return (
      <Container className="text-center pt-5">
        {dashboard}
        <Loading />
      </Container>
    );

  if(currentCourse.data === null) return GenericError("Could not find this course.")

  return (
    <Container className="text-center pt-5" style={{marginRight: "10rem"}} fluid="md">
      {dashboard}
      <Container className="text-center" style={{ width: "500px", marginLeft: "26rem" }}>
        <h2 className="text-center">Welcome to {currentCourse.data.courseCode}</h2>
        <h4 className="text-muted" style={{margin: "0%"}}>Semester: {currentCourse.data.semester}</h4>
        <h6 className="text-muted" style={{margin: "0%"}}>Room: {currentCourse.data.location}</h6>
      </Container>

      <Nav 
        className="justify-content-start" variant="pills">
        <Nav.Item className="flex-column">
          <Nav.Link
            style={{ width: "160px", border: "1px solid #2B82B3", padding: "20px 0px", margin: "1%"}}
            eventKey="announcements"
            onClick={() => {
              router.push({
                pathname: '[course]/announcements',
                query: {
                  course: course
                }
              });
            }}
          >
            Announcements
          </Nav.Link>

          <Nav.Link
            style={{ width: "160px", border: "1px solid #2B82B3", padding: "20px 0px", margin: "1%" }}
            eventKey="assignment"
            onClick={() => {
              router.push({
                pathname: '[course]/assignments',
                query: {
                  course: course
                }
              });
            }}
          >
            Assignments
          </Nav.Link>

          <Nav.Link
            style={{ width: "160px", border: "1px solid #2B82B3", padding: "20px 0px", margin: "1%" }}
            eventKey="Modules"
            onClick={() => {
              router.push({
                pathname: '[course]/file',
                query: {
                  course: course
                }
              });
            }}
          >
            Module
          </Nav.Link>

          {user.type == "Student" && (
            <Nav.Link
              style={{ width: "160px", border: "1px solid #2B82B3", padding: "20px 0px", margin: "1%" }}
              eventKey="Grades Summary"
              onClick={() => {
                router.push({
                  pathname: '[course]/grades',
                  query: {
                    course: course
                  }
                });
              }}
            >
              Grades
            </Nav.Link>
          )}

          <Nav.Link
            style={{ width: "160px", border: "1px solid #2B82B3", padding: "20px 0px", margin: "1%" }}
            eventKey="DiscussionBoard"
            onClick={() => {
              router.push({
                pathname: '[course]/posts',
                query: {
                  course: course
                }
              });
            }}
          >
            Discussion Board
          </Nav.Link>

          {user.type == "Teacher" && (
            <Nav.Link
              style={{ width: "160px", border: "1px solid #2B82B3", padding: "20px 0px", margin: "1%" }}
              eventKey="enrolledStudent"
              onClick={() => {
                router.push({
                  pathname: '[course]/enrolledStudents',
                  query: {
                    course: course
                  }
                });
              }}
            >
              Enrolled Students
            </Nav.Link>
          )}
        </Nav.Item>
      </Nav>
    </Container>
  );
};

Course.auth = true;
export default Course;
