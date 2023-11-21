//This will be the url for www.<website>.com/ because it is the base index file
import { trpc } from "../utils/trpc";
import { QueryClient, QueryClientProvider } from "react-query";
import { Todo } from "../components/Todo";

const client = new QueryClient();
export default function IndexPage() {
  const hello = trpc.useQuery(["hello", { text: "client" }]);
  trpc.useQuery(["hi", ""]);
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <QueryClientProvider client={client}>
      <Todo></Todo>
    </QueryClientProvider>
  );
}
