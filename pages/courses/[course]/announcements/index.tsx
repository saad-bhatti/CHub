import CoursePage from "components/CoursePage";
import GenericError from "components/GenericError";
import Loading from "components/Loading";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { AuthedPage } from "components/types";
import {
  InferGetServerSidePropsType
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, Container, Form } from "react-bootstrap";
import { trpc } from "utils/trpc";
import { CourseCodeValidator } from "utils/types/Course";


export const getServerSideProps = GSSPCoursePath;

const Announce: AuthedPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ course, session: { user } }) => {
  const query = trpc.useQuery(["course.announcements", course]);

  if (query.data === undefined) return <Loading />;
  if (query.data === null) return GenericError("Could not find this course.")

  return (
    <Container>
      {CoursePage({pathname: './', query: {course}})}
      <Card style={{ margin: "2rem" }}>
        <h4 className="text-center" style={{ margin: "1rem" }}>
          Announcements
        </h4>
        {query.data &&
          query.data.map((announcement) => (
            <Form key={announcement.announcementID}>
              <Form.Group className="card border-info mb-3" style={{ margin: "1rem", width: "95%"}}>
                <Form.Group className="card-body">
                  <h5 className="card-header">
                    {announcement.title}
                  </h5>
                  <p className="card-text text-muted" style={{ margin: "1rem"}}>{announcement.content}</p>
                </Form.Group>
              </Form.Group>
              <Form.Group className="left-aligned"></Form.Group>
            </Form>
          ))}
      </Card>

      {user.type == "Teacher" && (
        <Link
          href={{
            pathname: "./announcements/add",
            query: { course: course },
          }}
        >
          <Button variant="outline-primary" style={{ margin: "1rem" }}>
            Create a New Announcement
          </Button>
        </Link>
      )}
      <Link href={{
        pathname: './assignments',
        query: {
          course: course
        }
      }}>
        <Button
          variant="outline-primary"
          style={{ margin: "1rem" }}
        >
          Go to assignments
        </Button>
      </Link>
      <Link href={{
        pathname: './posts',
        query: {
          course: course
        }
      }}>
        <Button
          variant="outline-primary"
          style={{ margin: "1rem" }}
        >
          Go to posts
        </Button>
      </Link>
    </Container>
  );
};

Announce.auth = true;
export default Announce;
