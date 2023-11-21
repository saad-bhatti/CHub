import React, { RefObject } from "react";
import { Form, FloatingLabel, Col, InputGroup, Button } from "react-bootstrap";
import { InputValidator, InputValidatorFunc } from "./InputValidators";

export function createTextInput<T>(
  data: InputValidator<T>,
  label: string,
  key: keyof T,
  validator: InputValidatorFunc
) {
  return (
    <Form.Group as={Col} className="m-2">
      <FloatingLabel label={label} className="mb-3">
        <Form.Control
          placeholder={label}
          type="text"
          defaultValue={((data[key].initialValue as Object) || "").toString()}
          ref={data[key].ref}
          onChange={validator}
          isInvalid={!!data[key].err && data[key].touched}
          isValid={!data[key].err && data[key].touched}
          onFocus={() => (data[key].touched = true)}
          onBlur={validator}
        />
        <Form.Control.Feedback type="invalid">
          {data[key].err?.issues.at(0)?.message}
        </Form.Control.Feedback>
      </FloatingLabel>
    </Form.Group>
  );
}

export function createPasswordInput<T>(
  data: InputValidator<T>,
  label: string,
  key: keyof T,
  validator: InputValidatorFunc
) {
  return (
    <Form.Group as={Col} className="m-2">
      <InputGroup>
        <Button
          className="mb-1"
          variant="outline-secondary"
          id="button-addon1"
          onClick={() => {
            data[key].ref.current!.type =
              data[key].ref.current!.type === "text" ? "password" : "text";
            validator();
          }}
        >
          Reveal
        </Button>
        <FloatingLabel label={label} className="mb-1">
          <Form.Control
            placeholder={label}
            type="password"
            defaultValue={((data[key].initialValue as Object) || "").toString()}
            ref={data[key].ref}
            onChange={validator}
            isInvalid={!!data[key].err && data[key].touched}
            isValid={!data[key].err && data[key].touched}
            onFocus={() => (data[key].touched = true)}
            onBlur={validator}
          />
        </FloatingLabel>
      </InputGroup>
      <Form.Control.Feedback
        type="invalid"
        className={`${
          !!data[key].err && data[key].touched ? "d-block" : "d-none"
        }`}
      >
        {data[key].err?.issues.at(0)?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export function createTextAreaInput<T>(
  data: InputValidator<T>,
  label: string,
  key: keyof T,
  validator: InputValidatorFunc,
  rows: number
) {
  return (
    <Form.Group as={Col} className="m-2">
      <FloatingLabel label={label} className="mb-3">
        <Form.Control
          as="textarea"
          placeholder={label}
          type="text"
          defaultValue={((data[key].initialValue as Object) || "").toString()}
          ref={data[key].ref as unknown as RefObject<HTMLTextAreaElement>}
          onChange={validator}
          isInvalid={!!data[key].err && data[key].touched}
          isValid={!data[key].err && data[key].touched}
          onFocus={() => (data[key].touched = true)}
          onBlur={validator}
          style={{ height: `${rows * 1.5}rem` }}
          rows={rows}
        />
        <Form.Control.Feedback type="invalid">
          {data[key].err?.issues.at(0)?.message}
        </Form.Control.Feedback>
      </FloatingLabel>
    </Form.Group>
  );
}

export function createBoolInput<T>(
  data: InputValidator<T>,
  label: string,
  key: keyof T,
  validator: InputValidatorFunc
) {
  return (
    <Form.Group as={Col}>
      <Form.Switch
        label={label}
        defaultChecked={(data[key].initialValue || false) as any as boolean}
        ref={data[key].ref}
        className="m-4"

        // onChange={validator}
        // isInvalid={!!data[key].err && data[key].touched}
        // isValid={!data[key].err && data[key].touched}
        // onFocus={() => data[key].touched = true}
        // onBlur={validator}
      />
      <Form.Control.Feedback type="invalid">
        {data[key].err?.issues.at(0)?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export function createNumberInput<T>(
  data: InputValidator<T>,
  label: string,
  key: keyof T,
  validator: InputValidatorFunc
) {
  return (
    <Form.Group as={Col} className="m-2">
      <Form.Label className="text-primary">{label}</Form.Label>
      <Form.Control
        defaultValue={(data[key].initialValue || 0) as any as string}
        type="number"
        placeholder={label}
        ref={data[key].ref}
        onChange={validator}
        isInvalid={!!data[key].err && data[key].touched}
        isValid={!data[key].err && data[key].touched}
        onFocus={() => (data[key].touched = true)}
        onBlur={validator}
      />
      <Form.Control.Feedback type="invalid">
        {data[key].err?.issues.at(0)?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export function createDateInput<T>(
  data: InputValidator<T>,
  label: string,
  key: keyof T,
  validator: InputValidatorFunc
) {
  return (
    <Form.Group as={Col} className="m-2">
      <Form.Label className="text-primary">{label}</Form.Label>
      <Form.Control
        defaultValue={
          (data[key].initialValue || new Date().toDateString()) as any as string
        }
        type="date"
        placeholder={label}
        ref={data[key].ref}
        onChange={validator}
        isInvalid={!!data[key].err && data[key].touched}
        isValid={!data[key].err && data[key].touched}
        onFocus={() => (data[key].touched = true)}
        onBlur={validator}
      />
      <Form.Control.Feedback type="invalid">
        {data[key].err?.issues.at(0)?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
}

export function createSelectInput<T>(
  data: InputValidator<T>,
  label: string,
  key: keyof T,
  validator: InputValidatorFunc,
  options: string[]
) {
  return (
    <Form.Group as={Col} className="m-2">
      <FloatingLabel label={label}>
        <Form.Select
          placeholder={label}
          ref={data[key].ref as unknown as RefObject<HTMLSelectElement>}
          onChange={validator}
          isInvalid={!!data[key].err && data[key].touched}
          isValid={!data[key].err && data[key].touched}
          onFocus={() => (data[key].touched = true)}
          onBlur={validator}
          defaultValue={data[key].initialValue as unknown as string}
        >
          {options.map((o) => {
            return (
              <option key={o} value={`${o}`}>
                {o}
              </option>
            );
          })}
        </Form.Select>
      </FloatingLabel>
      <Form.Control.Feedback type="invalid">
        {data[key].err?.issues.at(0)?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
