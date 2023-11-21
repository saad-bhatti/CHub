import { useContext } from "react";
import { useQuery } from "react-query";
import { authed, getTodo } from "../state";

export default function DisplayTodo(props: { item: string }) {
  const items = useQuery(["todo"], getTodo);
  const authentication = useContext(authed);

  if (!items.data) return <div>Loading...</div>;
  return (
    <div>
      <ul>
        {items.data.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
      <div>state: {authentication.toString()}</div>
    </div>
  );
}
