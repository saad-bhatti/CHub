import Surreal from "surrealdb.js";

// PATTERN: singleton
const conn = new Surreal("http://127.0.0.1:8000/rpc");

export const surrealConnection = async (): Promise<Surreal> => {
  await conn.wait();
  await conn.signin({
    user: "root",
    pass: "root",
  });
  await conn.use("CHub", "CHub");
  return conn;
};

export const closeSurrealConnection = () => {
  conn.close();
};
