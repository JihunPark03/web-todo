import { title } from "@/components/primitives";
import CaloriesTable from "@/components/calories-table"

async function fetchCaloriesApiCall(){
	console.log("fetchTodoApi called");
	const response = await fetch(`${process.env.BASE_URL}/api/calories`,{cache: 'no-store'})
	if (!response.ok) {
		console.error(`API error: ${response.status} ${response.statusText}`);
		return null;
	}
	const contentTypeCheck = response.headers.get('Content-Type');
	if(contentTypeCheck?.includes("text/html")){
		return null;
	}
	return response.json();
}

export default async function Caloriespage() {

	const response = await fetchCaloriesApiCall();

	const fetchedCalories= response?.data ?? [];

	return (
		<div className="flex flex-col space-y-8">
			<h1 className={title()}>Calories</h1>
			<CaloriesTable calories={fetchedCalories}/>
		</div>
	);
}
