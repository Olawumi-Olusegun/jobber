import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {

    try {
        const { userId } = auth();
        const {name} = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        if(!name) {
            return new NextResponse("Title is missing", {status: 401})
        }

        const company = await prismadb.company.create({
            data: {
                userId,
                name,
                description: ""
            }
        });

        if(!company) {
            return new NextResponse("Unable to create new company", {status: 400})
        }

        return  NextResponse.json(company, {status: 201})
        
    } catch (error) {
        console.log(`[COMPANY_POST] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}