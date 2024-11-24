import { NextRequest, NextResponse } from "next/server"
 

export async function GET(request: NextRequest) {

    const response={
        message: 'Jihun',
        data: 'Jihun'

    }

    return NextResponse.json(response,{status: 201});
}
