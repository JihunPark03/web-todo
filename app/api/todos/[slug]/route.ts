import { NextRequest, NextResponse } from "next/server"
import { fetchATodo, deleteATodo, editATodo} from "@/data/firestore"

//할일 가져오기
export async function GET(request: NextRequest, {params}:{params: {slug: string}}) {

    const fetchedTodo = await fetchATodo(params.slug);

    if(fetchedTodo === null){
        return new NextResponse(null, {status:204})
    }

    const response={
        message: '단일 할일 가져오기',
        data:fetchedTodo

    }

    return NextResponse.json(response,{status: 200});
}

//삭제
export async function DELETE(request: NextRequest, {params}:{params: {slug: string}}) {

    const deletedTodo= await deleteATodo(params.slug);

    if (deletedTodo === null){
        const falseresponse={
            message: '존재하지 않는 할일'
        }
        return NextResponse.json(falseresponse,{status: 500});
    }

    const response={
        message: '단일 할일 삭제 성공'
    }

    return NextResponse.json(response,{status: 200});
}

//수정
export async function POST(request: NextRequest, {params}:{params: {slug: string}}) {

    const {title, is_done} = await request.json();

    const editedTodo= await editATodo(params.slug, {title, is_done})

    if (editedTodo === null){
        return NextResponse.json({status: 204});
    }

    const response={
        message: '단일 수정 성공!',
        data:editedTodo

    }

    return NextResponse.json(response,{status: 200});
}