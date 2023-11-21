import React from "react";
import { Container, Row } from "react-bootstrap";
import { UserInputValidator } from "../utils/types/User";
import z from "zod";

export default function Profile(user: z.infer<typeof UserInputValidator>) {
  return (
    <Container>
      <Row>
        <p>
          {" "}
          <strong>Name:</strong> {user.username}
        </p>
      </Row>
      <Row>
        <p>{user.id}</p>
        <p>{user.email}</p>
      </Row>
      <Row>
        <p>{user.type}</p>
      </Row>
    </Container>
  );
}
