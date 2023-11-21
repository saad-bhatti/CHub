import { RefObject } from "react";
import { boolean, z, ZodType } from "zod";
import { zodError } from "../constants";

type InputData<T> = {
  initialValue?: T;
  err?: z.infer<typeof zodError>;
  readonly ref: RefObject<HTMLInputElement>;
  validator: ZodType<T, any, any>;
  touched: boolean;
};
export type InputValidator<T> = {
  [key in keyof T]: InputData<T[key]>;
};

export type InputValidatorFunc = () => boolean;
