import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Button, Row } from "react-bootstrap";
import { AuthedPage } from "components/types";
import UserProfile from "components/Profile";

const Profile: AuthedPage = ({ session: { user } }) => {
  const router = useRouter();

  const dashboard = (
    <Row className="mb-3" style={{ marginTop: "1.5rem" }}>
      <Link href={{
        pathname: '../courses'
      }}>
        <Button
          className="w-auto"
        >
          Back to Dashboard
        </Button>
      </Link>
    </Row>
  );

  return (
    <Container>
      {dashboard}

      {UserProfile(user)}

      <Container>
        <Link href="./profile/edit">
          <Button variant="primary">Edit</Button>
        </Link>
      </Container>
    </Container>
  );
};

Profile.auth = true;
export default Profile;
