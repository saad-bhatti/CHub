import React, { useRef, useState } from "react";
import { z, ZodType } from "zod";
import { InputValidator } from "./InputValidators";

const useForm = <T>(data: {
  [key in keyof T]: {
    initialValue?: T[key];
    validator: ZodType<T[key], any, any>;
    HTMLattribute?: keyof HTMLInputElement;
  };
}): [
  InputValidator<T>,
  React.Dispatch<React.SetStateAction<InputValidator<T>>>,
  () => boolean
] => {
  const obj = {} as InputValidator<T>;
  for (const k in data) {
    obj[k] = {
      initialValue: data[k].initialValue,
      validator: data[k].validator,
      ref: useRef<HTMLInputElement>(null),
      touched: false,
    };
  }
  const [state, setState] = useState<InputValidator<T>>(obj);
  return [
    state,
    setState,
    () => {
      // Note that since this uses useState, it can be called just to cause rerender
      let valid = true;

      for (const k in data) {
        const prop = state[k];
        const ref = prop.ref.current;
        if (ref === null) throw TypeError("Ref was not assigned");

        let defaultValue: keyof HTMLInputElement;
        switch (typeof prop.initialValue) {
          case "number":
            defaultValue = "valueAsNumber";
            break;
          case "boolean":
            defaultValue = "checked";
            break;
          case "object":
            if (prop.validator._output instanceof Date)
              defaultValue = "valueAsDate";
            else defaultValue = "value";
            break;
          default:
            defaultValue = "value";
        }

        const pass = prop.validator.safeParse(
          ref[(data[k].HTMLattribute || defaultValue) as keyof HTMLInputElement]
        );
        prop.err = pass.success ? undefined : pass.error;
        if (!pass.success) valid = false;
      }
      setState({ ...state });
      return valid;
    },
  ];
};

export default useForm;
