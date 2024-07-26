import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request, { params: { jobId } }: { params: { jobId: string; } }) => {
    try {
        
        const { userId } = auth();
        
        if(!userId) {
            return NextResponse.json("Unauthorized", {status: 401})
        }

        if(!jobId) {
            return NextResponse.json("Job ID not found", {status: 404})
        }

        const job = await prismadb.job.findUnique({
            where: {
                id: jobId,
                userId,
            }
        });

        if(!job) {
            return NextResponse.json("Job not found", {status: 404})
        }

        const publishedJob = await prismadb.job.update({
            where: {
                id: jobId,
            },
            data: {
                isPublished: false
            }
        })

        return NextResponse.json(publishedJob, { status: 200 });


    } catch (error) {
        console.log(`[JOB_PUBLISH_PATCH]: ${error}`)
        return NextResponse.json("Internal server error", {status: 500})
    } 
}