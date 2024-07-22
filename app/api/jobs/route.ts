import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {

    try {
        const { userId } = auth();
        const {title} = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        if(!title) {
            return new NextResponse("Title is missing", {status: 401})
        }

        const job = await prismadb.job.create({
            data: {
                userId,
                title,
            }
        });

        if(!job) {
            return new NextResponse("Unable to create new job", {status: 400})
        }

        return  NextResponse.json(job, {status: 201})
        
    } catch (error) {
        console.log(`[JOB_POST] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}