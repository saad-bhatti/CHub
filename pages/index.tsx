//This will be the url for www.<website>.com/ because it is the base index file
import { QueryClient, QueryClientProvider } from "react-query";
import { Container, Form, Button, Image } from "react-bootstrap";

import Link from "next/link";

const client = new QueryClient();
export default function IndexPage() {
  return (
    <Container>
      <Form>
        <Form.Group>
          <Link href={"/auth/register"}>
            <Button
              variant="outline-primary float-end"
              style={{ margin: "0.5rem" }}
            >
              Register
            </Button>
          </Link>
        </Form.Group>
        <Form.Group>
          <Link href={"/auth/login"}>
            <Button
              variant="outline-primary float-end"
              style={{ margin: "0.5rem" }}
            >
              Login
            </Button>
          </Link>
        </Form.Group>
        <Image
          className="rounded mx-auto d-block"
          src="/title-page-logo.png"
          alt="Logo"
          style={{ margin: "6rem" }}
        />
      </Form>
    </Container>
  );
}
