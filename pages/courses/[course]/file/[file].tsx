import GenericError from "components/GenericError";
import Loading from "components/Loading";
import GSSPUrlParams from "components/props/GSSPUrlParam";
import { AuthedPage } from "components/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Card, Container } from "react-bootstrap";
import { trpc } from "utils/trpc";
import { CourseCodeValidator } from "utils/types/Course";
import { z } from "zod";

export const getServerSideProps = GSSPUrlParams({course: CourseCodeValidator, file: z.string()})

const DisplayFile: AuthedPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ course, file }) => {

  const query = trpc.useQuery([
    "course.fileContent",
    { code: course, fileName: file },
  ]);
  if (query.data === undefined) return <Loading />;
  if (query.data === null) return GenericError("File content not found.")

  return (
    <Container>
      <>
        <Card className="m-3">
          <Card.Body>
            <Card.Title>{file}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{course}</Card.Subtitle>
            <Card.Text style={{ whiteSpace: "pre-wrap" }}>
              {query.data}
            </Card.Text>
          </Card.Body>
        </Card>
        <Link
          href={{
            pathname: "./",
            query: { course: course },
          }}
        >
          <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
            Go back
          </Button>
        </Link>
      </>
    </Container>
  );
};

DisplayFile.auth = true;
export default DisplayFile;
