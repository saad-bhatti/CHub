import { Table, Container, Card } from "react-bootstrap";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { InferGetServerSidePropsType } from "next";
import { AuthedPage } from "components/types";
import Loading from "components/Loading";
import CoursePage from "components/CoursePage";
import { trpc } from "utils/trpc";
import GenericError from "components/GenericError";

export const getServerSideProps = GSSPCoursePath;

const Summary: AuthedPage<
  InferGetServerSidePropsType<typeof GSSPCoursePath>
> = ({ course, session: { user } }) => {
  const query = trpc.useQuery(["course.assignments", course]);
  const grades = trpc.useQuery([
    "user.courseAssignmentGrades",
    { userId: user.id, courseCode: course },
  ]);


  if (query.data === undefined)
    return (
      <Container className="text-center pt-5">
        <Loading />
      </Container>
    );

  if(query.data === null) return GenericError("Could not find any grades.")

  return (
    <Container className="text-center pt-5">
      <>
      {CoursePage({pathname: './', query: {course}})}
        <Card style={{ margin: "2rem", marginLeft: "3rem", width: "94.5%" }}>
          <h4 className="text-center" style={{ margin: "1rem" }}>
            Grades
          </h4>
        </Card>
        <Table striped="columns" bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Score</th>
              <th>Out of</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {query.data.map((assignment) => {
              return (
                <tr
                  className="p-3"
                  key={assignment.id}
                  style={{ margin: "1rem" }}
                >
                  <td className="card-title">{assignment.title}</td>
                  <td className="card-subtitle">
                    <>{assignment.dueDate.toUTCString()}</>
                  </td>

                  <td className="card-subtitle">
                  {(grades.data !== undefined && grades.data !== null 
                  && grades.data[assignment.id] !== null) ? (
                      `${grades.data[assignment.id]}`
                      ) : "Not Graded"}
                  </td>

                  <td className="card-subtitle">100</td>
                  <td className="card-subtitle">
                    <>{assignment.weight}</>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    </Container>
  );
};

Summary.auth = true;
Summary.role = "Student";
export default Summary;
