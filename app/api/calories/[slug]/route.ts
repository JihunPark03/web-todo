import { NextRequest, NextResponse } from "next/server"
import { fetchACalorie, deleteACalorie, editACalorie } from "@/data/firestore"

//한 날짜의 칼로리 가져오기
export async function GET(request: NextRequest, {params}:{params: {slug: string}}){

    const fetchedCalorie = await fetchACalorie(params.slug);

    if (fetchedCalorie === null){
        return new NextResponse(null, {status:204})
    }

    const response={
        message: '해당 날짜의 칼로리 가져오기',
        data: fetchedCalorie
    }

    return NextResponse.json(response, {status:200})
}

//한 날짜의 내용 다 삭제하기
export async function DELETE(request: NextRequest, {params}:{params: {slug: string}}){

    const deletedCalorie = await deleteACalorie(params.slug);

    if (deletedCalorie === null){
        const falseresponse={
            message: '존재하지 않는 내용'
        }
        return NextResponse.json(falseresponse, {status:500})
    }

    const response={
        message: '해당 날짜의 모든 내용이 지워집니다',
        data: deletedCalorie
    }

    return NextResponse.json(response, {status:200})
}

//한 날짜의 각 항목의 칼로리 수정하기
export async function POST(request: NextRequest, {params}:{params: {slug: string}}) {

    const {breakfast, lunch, dinner, snack} = await request.json();
    //이건 json으로 받는다
    const editedCalorie = await editACalorie(params.slug, {breakfast, lunch, dinner, snack})

    if (editedCalorie === null){
        return NextResponse.json({status: 204});
    }

    const response={
        message: '한 날짜의 각 항목의 칼로리 수정하기 성공!',
        data: editedCalorie
    }

    return NextResponse.json(response,{status: 200});
}
