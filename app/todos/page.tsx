import { title } from "@/components/primitives";
import TodosTable from "@/components/todos-table";

async function fetchTodosApiCall(){
	console.log("fetchTodoApi called");
	const response = await fetch(`${process.env.BASE_URL}/api/todos`,{cache: 'no-store'})
	const contentTypeCheck = response.headers.get('Content-Type');
	if(contentTypeCheck?.includes("text/html")){
		return null;
	}
	return response.json();
}

export default async function Todospage() {

	const response = await fetchTodosApiCall();

	const fetchedTodos= response?.data ?? [];

	return (
		<div className="flex flex-col space-y-8">
			<h1 className={title()}>Todos</h1>
			<TodosTable todos={fetchedTodos}/>
		</div>
	);
}
