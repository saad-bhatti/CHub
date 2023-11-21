import { Container, Form, Button, Image, Alert } from "react-bootstrap";
import { trpc } from "utils/trpc";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { getSession, signIn, useSession } from "next-auth/react";
import {
  User,
  UserIdValidator,
  UserPasswordValidator,
} from "utils/types/User";
import useForm from "utils/forms/FormValidator";
import { useRouter } from "next/router";
import {
  createPasswordInput,
  createTextInput,
} from "utils/forms/CreateForm";
import Link from "next/link";
import {GSSPUrl} from "components/props/GSSPUrlParam";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps = GSSPUrl({},{ error: z.string() });

function Login({
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [input, setData, validator] = useForm<{ id: string; password: string }>(
    {
      id: {
        validator: z.string(),
      },
      password: {
        validator: z.string(),
      },
    }
  );
  const router = useRouter();
  const [callbackurl, setCallback] = useState<string>();

  useEffect(() => {
    if (!router.isReady) return;
    setCallback(router.query.callbackUrl as string);
  }, [router.isReady, router.query]);

  function handle() {
    for (const key in input) input[key as keyof typeof input].touched = true;
    if (!validator()) return;

    signIn("credentials", {
      id: input.id.ref.current!.value,
      password: input.password.ref.current!.value,
      callbackUrl: callbackurl || window.location.origin + "/courses",
    });
  }

  return (
    <Container>
      <Image src="/top-left-logo.png" alt="Logo" />
      {error ? (
        <Alert variant="danger" className="m-4">
          {(() => {
            switch (error) {
              case "CredentialsSignin":
                return "Wrong Username or Password";
              case "SessionRequired":
                return "Please log in";
              default:
                "An error has occured, please try again";
            }
          })()}
        </Alert>
      ) : (
        <></>
      )}
      <Form>
        {createTextInput(input, "User Id", "id", validator)}
        {createPasswordInput(input, "Password", "password", validator)}

        <Form.Group>
          <Link href={"./register"}>
            <Form.Label className="link-primary">
              <u>No account? Click here to register!</u>
            </Form.Label>
          </Link>
        </Form.Group>

        <Button className="btn" style={{ margin: "0.5rem" }} onClick={handle}>
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
