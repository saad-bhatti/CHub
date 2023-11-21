import React from "react";
import { Container, Alert } from "react-bootstrap";

export default function GenericError(message: String) {
  return (
    <Container>
      <Alert variant="danger">
        <Alert.Heading>Something went wrong!</Alert.Heading>
        <p>{message}</p>
      </Alert>
    </Container>
  );
}
