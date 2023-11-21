import Link from "next/link";
import { createContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { addTodo, authed, getTodo } from "../state";
import Display from "./Display";
import { Form, Button, Container } from "react-bootstrap";

export function Todo() {
  const [item, setItem] = useState("");
  const queryClient = useQueryClient();
  const query = useQuery(["todo"], getTodo);

  const mutationfn = useMutation(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todo"]);
    },
  });

  if (query.isLoading && query.data) return <div>Loading...</div>;
  return (
    <Container>
      <Form>
        <Form.Group>
          <Form.Control
            placeholder="new item"
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
          <Button variant="primary" onClick={() => mutationfn.mutate(item)}>
            Submit
          </Button>
        </Form.Group>
      </Form>
      <authed.Provider value={false}>
        <Display item={item}></Display>
      </authed.Provider>
    </Container>
  );
}
