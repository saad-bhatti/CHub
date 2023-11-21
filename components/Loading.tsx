import { Container, Spinner } from "react-bootstrap";

const Loading = (): JSX.Element => {
  return (
    <Container>
      <Spinner animation="border"></Spinner>
    </Container>
  );
};

export default Loading;
