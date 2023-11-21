import { Container, Form, Button } from "react-bootstrap";
import { z } from "zod";
import {
  UserInputValidator,
  UsernameValidator,
  UserPasswordValidator,
  UserEnum,
  UserEmailValidator,
} from "utils/types/User";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";
import useForm from "utils/forms/FormValidator";
import {
  createPasswordInput,
  createSelectInput,
  createTextInput,
} from "utils/forms/CreateForm";

export default function Register() {
  const add = trpc.useMutation(["user.add"]);
  const router = useRouter();
  const Editables = UserInputValidator.omit({
    id: true,
    enrolledCourses: true,
    visible: true,
  });

  const [data, setData, validator] = useForm<z.infer<typeof Editables>>({
    username: {
      validator: UsernameValidator,
    },
    email: {
      validator: UserEmailValidator,
    },
    password: {
      validator: UserPasswordValidator,
    },
    type: {
      initialValue: "Student",
      validator: UserEnum,
    },
  });

  function handle() {
    for (const key in data) data[key as keyof typeof data].touched = true;
    if (!validator()) return;
    add.mutate(
      {
        username: data.username.ref.current!.value,
        password: data.password.ref.current!.value,
        email: data.email.ref.current!.value,
        type: data.type.ref.current!.value as z.infer<typeof UserEnum>,
        id: Math.floor(Math.random() * 100000000).toString(8),
        enrolledCourses: [],
        visible: true,
      },
      {
        onSuccess: (data, variable, context) => {
          router.push(`./${variable.id}`);
        },
      }
    );
  }
  
  return (
    <Container>
      <h4 className="text-center" style={{ margin: "1rem" }}>
        Create New Account
      </h4>
      <Form>
        {createTextInput(data, "Username", "username", validator)}
        {createTextInput(data, "Email Address", "email", validator)}
        {createPasswordInput(data, "Password", "password", validator)}
        {createSelectInput(data, "Select User Type", "type", validator, [
          "Student",
          "Teacher",
        ])}

        <Button onClick={handle}>Register</Button>
      </Form>
    </Container>
  );
}
