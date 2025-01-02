import { NextRequest, NextResponse } from "next/server";
import { addACalories, fetchCalories} from '@/data/firestore'

export async function GET(request: NextRequest) {
	const fetchedCalories = await fetchCalories();
	const response={
		message: '다 가져오기',
		data: fetchedCalories
	}

	return NextResponse.json(response, {status: 200});
}

export async function POST(request: NextRequest){
	
	const {calorie} = await request.json();

	if(calorie === undefined){
		const errMessage={
			message: "칼로리를 입력해주세요"
		}
		return NextResponse.json(errMessage, {status: 422});
	}

	const addedCalorie = await addACalories({calorie});

	const response = {
		message: '칼로리 추가 성공',
		data: addedCalorie
	}

	return NextResponse.json(response, {status: 201});
}
