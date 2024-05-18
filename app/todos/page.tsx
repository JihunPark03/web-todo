import { title } from "@/components/primitives";
import TodosTable from "@/components/todos-table";

async function fetchTodosApiCall(){
	console.log("fetchTodoApi called");
	const resposne = await fetch(`${process.env.BASE_URL}/api/todos`)
	return resposne.json();
}

export default async function Todospage() {

	const response = await fetchTodosApiCall();
	return (
		<div className="flex flex-col space-y-8">
			<h1 className={title()}>Todos</h1>
			<TodosTable todos={response.data ?? []}/>
		</div>
	);
}
