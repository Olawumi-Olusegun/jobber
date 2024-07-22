import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params: { jobId }}: {params: { jobId: string }}) => {
    try {

        const { userId } = auth();

        const updatedValues = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!jobId) {
            return new NextResponse("Job ID is missing", {status: 401})
        }

        const job = await prismadb.job.update({
            where: { id: jobId },
            data: updatedValues
        });

        if(!job) {
            return new NextResponse("Unable to update job", {status: 400})
        }

        return  NextResponse.json(job, {status: 200})
        
    } catch (error) {
        console.log(`[JOB_POST] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}