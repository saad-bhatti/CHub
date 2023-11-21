import React from "react";
import { Container, Row, Alert } from "react-bootstrap";

export default function WrongUserError() {
  return (
    <Container>
      <Row>
        <Alert variant="danger">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>You are not authorized to view this page.</p>
        </Alert>
      </Row>
    </Container>
  );
}
