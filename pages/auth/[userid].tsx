import { useRouter } from "next/router";
import { Container, Button } from "react-bootstrap";
import Link from "next/link";
import GSSPUrlParams from "components/props/GSSPUrlParam";
import { UserIdValidator } from "utils/types/User";
import { InferGetServerSidePropsType, NextPage } from "next";

export const getServerSideProps = GSSPUrlParams({"userid": UserIdValidator})
export const userId: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({userid}) => {

  return (
    <Container>
      <h2 style={{ margin: "0.5rem" }}>New Account Created!</h2>
      <h4 style={{ margin: "0.5rem" }}>Please use the user id to login: {userid}</h4>

      <Link href={"./login"}>
        <Button variant="outline-primary" style={{ margin: "0.5rem" }}>
          Login here!
        </Button>
      </Link>
    </Container>
  );
}

export default userId;