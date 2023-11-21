import { createContext } from "react";

const globalState = {
  todo: [] as string[],
};

export const getTodo = async () => globalState.todo;
export const addTodo = async (item: string) => globalState.todo.push(item);
export const authed = createContext(true);
