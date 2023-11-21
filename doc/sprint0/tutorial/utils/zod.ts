// This is a introductory file to how zod works
// https://github.com/colinhacks/zod
import { z } from "zod";

const a = z.string();

let test = a.parse("hello");
test;

const b = z
  .string()
  .min(10, { message: "must be more than 10 characters" })
  .max(100);
// b.parse("a")
let err1 = b.safeParse("a");
err1;

test = b.parse("1234567890");
test;

const c = z.string().default("default");
test = c.parse(undefined);
test;

// const personValidator = z.object({name: z.string(), id: b})
const personValidator = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  id: b,
});
// personValidator.parse({})
let err2 = personValidator.safeParse({});
err2;

// Important to notice does not have restrictions
type Person = z.infer<typeof personValidator>;

// let person: Person = {id: "1234567890"}
let person: Person = { name: "ezz", id: "" };
let check = personValidator.safeParse(person);

if (check.success) {
  console.log("yay");
} else {
  console.log("nay");
}

const f1 = z.function(); // just creates a function
type F1 = z.infer<typeof f1>;

const f2 = z.function().args(personValidator).returns(z.boolean()); // will throw error if given input or output is wrong
type F2 = z.infer<typeof f2>;

const personIDcheck = f2.implement((person) => {
  return person.id.length > 18;
});

// personIDcheck({name: "hello"})
