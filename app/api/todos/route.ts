import { NextRequest, NextResponse } from "next/server";
import { fetchTodos, addATodos} from '@/data/firestore'
 
// 모든 할일 가져오기
export async function GET(request: NextRequest) {

    const fetchedTodos= await fetchTodos();
    const response={//반환
        message: 'todos 몽땅 가져오기',
        data: fetchedTodos
    }

    return NextResponse.json(response,{status: 200});
}

//할일 추가
export async function POST(request: NextRequest) {

    const {title} = await request.json();

    if (title === undefined){

        const errMessage={
            message: "할일을 작성해주세요"
        } 
        return NextResponse.json(errMessage,{status: 422});

    }

    const addedTodo = await addATodos({title});

    const response = {
        message: '할일 추가 성공',
        data: addedTodo
    }

    return NextResponse.json(response,{status: 201});
}
