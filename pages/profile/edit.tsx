import React, { useRef } from "react";
import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "react-query";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  ButtonGroup,
  ButtonToolbar,
} from "react-bootstrap";
import { AuthedPage } from "components/types";
import { z } from "zod";
import { InputValidator } from "utils/forms/InputValidators";
import {
  UserEmailValidator,
  UserMutableInputValidator,
  UsernameValidator,
  UserPasswordValidator,
  UserVisible,
} from "utils/types/User";
import { trpc } from "utils/trpc";
import useForm from "utils/forms/FormValidator";
import { useRouter } from "next/router";
import { createBoolInput, createTextInput } from "utils/forms/CreateForm";

const EditProfile: AuthedPage = ({ session: { user: olduser } }) => {
  const Editables = UserMutableInputValidator.omit({
    enrolledCourses: true,
  });

  const queryClient = useQueryClient();
  const mutationfn = trpc.useMutation(["user.update"], {
    onSuccess: () => {
      queryClient.invalidateQueries(["user.get"]);
    },
  });
  const router = useRouter();

  const [user, setUser, validator] = useForm<
    z.infer<typeof Editables> & { confirmpassword: string }
  >({
    username: {
      initialValue: olduser.username,
      validator: UsernameValidator,
    },
    email: {
      initialValue: olduser.email,
      validator: UserEmailValidator,
    },
    password: {
      validator: UserPasswordValidator.or(z.string().length(0)),
    },
    visible: {
      initialValue: olduser.visible,
      validator: UserVisible,
    },
    confirmpassword: {
      validator: z.string().refine(
        (value): boolean => value == user.password.ref.current?.value,
        { message: "Must match password" }
      ),
    },
  });

  function handle() {
    for (const key in user) user[key as keyof typeof user].touched = true;
    if (!validator()) return;

    mutationfn.mutate(
      {
        id: olduser.id,
        newUser: {
          username: user.username.ref.current!.value,
          email: user.email.ref.current!.value,
          password: user.password.ref.current!.value || olduser.password,
          enrolledCourses: olduser.enrolledCourses,
          visible: user.visible.ref.current!.checked,
        },
      },
      {
        onSuccess: async () => {
          const event = new Event("visibilitychange");
          document.dispatchEvent(event); // refresh session
          router.push("/profile");
        },
      }
    );
  }
  return (
    <Container fluid="md">
      <Form noValidate>
        <Row className="mt-5 mb-1">
          {createTextInput(user, "Username", "username", validator)}
          {createTextInput(user, "Email", "email", validator)}
          {createBoolInput(user, "Visible to others", "visible", validator)}
        </Row>
        <Row className="mb-3">
          {createTextInput(user, "New Password", "password", validator)}
          {createTextInput(user, "Old Password", "confirmpassword", validator)}
        </Row>
      </Form>
      {/* <Form className="mb-3">
         <Form.Label as={Col} controlId="formGridPermission">
           Profile Permission
         </Form.Label>
         <Form.Select
           aria-label="Default select example"
           value={perm}
           onChange={(e) => setPermission(e.target.value)}
         >
           <option>Select Access Permission</option>
           <option>All students</option>
           <option>Professor only</option>
         </Form.Select>
       </Form> */}

      <ButtonToolbar aria-label="Toolbar with button groups">
        <ButtonGroup className="me-2" aria-label="First group">
          <Link href="./">
            <Button variant="primary">Cancel</Button>
          </Link>
        </ButtonGroup>
        <ButtonGroup className="me-2" aria-label="Second group">
          <Button variant="primary" onClick={handle}>
            Save
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </Container>
  );
};

EditProfile.auth = true;
export default EditProfile;
