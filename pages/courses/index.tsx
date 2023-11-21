import { Button, Container, Row, Card, Form } from "react-bootstrap";
import { AuthedPage } from "components/types";
import { trpc } from "utils/trpc";
import Loading from "components/Loading";
import Link from "next/link";
import { useRouter } from "next/router";
import GenericError from "components/GenericError";

const EnrolledCourse: AuthedPage = ({ session: { user } }) => {
  const router = useRouter();
  let query = trpc.useQuery(["user.courses", user.id]);

  if (query.data === undefined || query.data === null)
    return (
      <Container className="text-center pt-5">
        <Loading />
      </Container>
    );

  if(query.data === null) return GenericError("Could not find any courses.");
  const DashboardView = (
    <>
      {query.data.map((course) => {
        if (course.status || user.type == "Teacher") {
          return (
            <Card
              className="p-3"
              style={{ margin: "1.2cm" }}
              key={course.courseCode}
            >
              <h4 className="card-title">{course.courseCode}</h4>
              <h5 className="card-subtitle mb-3 text-muted">
                <>{course.semester}</>
              </h5>
              <h5 className="card-subtitle mb-3">
                <>{course.location}</>
              </h5>
              <Link
                href={{
                  pathname: `courses/[course]`,
                  query: {
                    course: course.courseCode
                  }
                }}
              >
                <Button
                  variant="outline-primary"
                  className="mx-3"
                  style={{ margin: "0.6rem" }}
                >
                  Home Page
                </Button>
              </Link>
              {user.type == "Teacher" && (
                <Link
                  href={{
                    pathname: `courses/[course]/edit`,
                    query: {
                      course: course.courseCode
                    }
                  }}
                >
                  <Button variant="outline-primary" className="mx-3">
                    Edit Course Info
                  </Button>
                </Link>
              )}
            </Card>
          );
        }
        
      })}
    </>
  );

  return (
    <Container>
      <h3
        style={{
          marginTop: "2rem",
          textDecorationLine: "underline",
          textUnderlineOffset: "0.2cm",
        }}
      >
        Dashboard
      </h3>

      <Form.Group>
        <Link href={"/api/auth/signout"}>
          <Button
            variant="outline-secondary float-end"
            style={{ margin: "0.5rem" }}
          >
            Sign out
          </Button>
        </Link>
      </Form.Group>
        <Link href={{
          pathname: '../profile',
        }}>
        <Button
          variant="outline-primary float-end"
          style={{ margin: "0.5rem" }}
        >
          Profile
        </Button>
        </Link>

      {user.type == "Teacher" && (
        <Link href={{
          pathname: './courses/add'
        }}>
          <Button
            variant="outline-primary float-end"
            style={{ margin: "0.5rem" }}
          >
            Add Course
        </Button>
        </Link>
      )}

      <Row className="row row-cols-1 row-cols-md-3 g-4 mb-5">
        {DashboardView}
      </Row>
    </Container>
  );
};

EnrolledCourse.auth = true;
export default EnrolledCourse;
