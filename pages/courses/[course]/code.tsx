import Loading from "components/Loading";
import { AuthedPage } from "components/types";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import { trpc } from "utils/trpc";
import { CourseCodeValidator } from "utils/types/Course";
import { z } from "zod";

const DisplayLink: AuthedPage = ({ session: { user } }) => {
  const router = useRouter();
  const [course, setCourse] = useState<z.infer<typeof CourseCodeValidator>>("");
  const joinCourse = trpc.useMutation(["user.joinCourse"]);

  useEffect(() => {
    if (!router.isReady) return;

    setCourse(CourseCodeValidator.parse(router.query.course));
  }, [router.isReady, router.query.course]);

  function joinUser() {
    joinCourse.mutate({ user: user.id, courseCode: course },{
      onSuccess: (result, variable, context) => {
        router.push({
          pathname: './'
        });
      },
    });
  }

  if (!course) return <Loading></Loading>;

  return (
    <Container className="m-auto">
      <Card style={{ margin: "2rem", marginLeft: "3rem", width: "94.5%" }}>
        <h4 className="text-center" style={{ margin: "1rem" }}>
        Joining a course
        </h4>
      </Card>
      <Container>
        {user.enrolledCourses.includes(course)? (
            <h5 style={{ margin: "0.5rem" }}>
              You are already in the course: {course}
            </h5>
        ):(
          <>
            <h5 style={{ margin: "0.5rem" }}>
              Click the button to join course {course}
            </h5>
            <Button onClick={joinUser} variant="outline-primary" style={{ margin: "0.5rem" }}>
              Join Course
            </Button>
          </>
        ) }

        {user.type === "Teacher" && (
          <>
            <h5 style={{ margin: "0.5rem" }}>
                Please send this link to students to join the course: {router.asPath}
            </h5>
          </>
        )}

        {user.enrolledCourses.includes(course) && (
          <>
          <Link href='./'>
            <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
              Go to Course Page  
            </Button>
          </Link>
          <Link href='../'>
            <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
              Back to Dashboard
            </Button>
          </Link>
          </>
        )}
      </Container>
    </Container>
  )

      {/* {user.type === "Teacher" && (
            <h5 style={{ margin: "0.5rem" }}>
              Please send this link to students to join the course: {router.asPath}
            </h5>
            )}
          <Link href='./'>
            <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
              Go to Course Page  
            </Button>
          </Link>
          <Link href='../'>
            <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
              Back to Dashboard
            </Button>
          </Link>
        </>
      {user.type == "Teacher" && !user.enrolledCourses.includes(course) && (
        <Container>
          <h5 style={{ margin: "0.5rem" }}>
            Click the button to join course {course}
          </h5>
          <Button onClick={joinUser} variant="outline-primary" style={{ margin: "0.5rem" }}>
            Join Course
          </Button>
          <h5 style={{ margin: "0.5rem" }}>
            Please send this link to students to join the course: {router.asPath}
          </h5>
        </Container>
      )}

      {user.type == "Teacher" && user.enrolledCourses.includes(course) && (
        <Container>
          
          
          <Link href='./'>
            <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
              Go to Course Page  
            </Button>
          </Link>
          <Link href='../'>
            <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
              Back to Dashboard
            </Button>
          </Link>
        </Container>
      )}

      {user.type == "Student" && !user.enrolledCourses.includes(course) && (
        <Container>
          <h5 style={{ margin: "0.5rem" }}>
            Click the button to join course {course}
          </h5>
          <Button onClick={joinUser} variant="outline-primary" style={{ margin: "0.5rem" }}>
            Join Course
          </Button>
        </Container>
      )}

      {user.type == "Student" && user.enrolledCourses.includes(course) && (
        <Container>
          <h5 style={{ margin: "0.5rem" }}>
            You are already in the course: {course}
          </h5>
          <Link href={`${router.asPath}/../../${course}`}>
            <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
              Go to Course Page  
            </Button>
          </Link>
          <Link href={`${router.asPath}/../../`}>
            <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
              Back to Dashboard
            </Button>
          </Link>
        </Container>
      )}
    </Container>
  ); */}
};

DisplayLink.auth = true;
export default DisplayLink;
