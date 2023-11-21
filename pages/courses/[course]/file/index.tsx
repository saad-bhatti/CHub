import CoursePage from "components/CoursePage";
import GenericError from "components/GenericError";
import Loading from "components/Loading";
import { GSSPCoursePath } from "components/props/GSSPCoursePath";
import { AuthedPage } from "components/types";
import { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import React from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { trpc } from "utils/trpc";

export const getServerSideProps = GSSPCoursePath;

const DisplayFiles: AuthedPage<
  InferGetServerSidePropsType<typeof GSSPCoursePath>
> = ({ course, session: { user } }) => {

  const query = trpc.useQuery(["course.filenames", course]);
  if (query.data === undefined) return <Loading />;
  if (query.data === null) return GenericError("Could not course files.")

  return (
    <Container>
      <>
        {CoursePage({pathname: './', query: {course}})}
        <Card style={{ margin: "2rem", marginLeft: "3rem", width: "94.5%" }}>
          <h4 className="text-center" style={{ margin: "1rem" }}>
            Modules
          </h4>
        </Card>
        {query.data &&
          query.data.map((filename) => (
            <Link
              href={{
                pathname: "./[file]",
                query: { course: course, file: filename },
              }}
              key={filename}
            >
              <Card style={{ margin: "2rem" }}>
                <Card.Header>
                  <h3 className="text-primary">{filename}</h3>
                </Card.Header>
              </Card>
            </Link>
          ))}

        {user.type == "Teacher" && (
          <Form>
            <Form.Check className="d-flex justify-content-center">
              <Link
                href={{
                  pathname: "./add",
                  query: { course: course },
                }}
              >
                <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
                  Add a File
                </Button>
              </Link>
            </Form.Check>
          </Form>
        )}
      </>
    </Container>
  );
};

DisplayFiles.auth = true;
export default DisplayFiles;
