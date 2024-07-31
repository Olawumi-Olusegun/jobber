import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request) => {

    try {

        const { userId } = auth();

        const jobId = await request.text();

        if(!userId) {
            return NextResponse.json("Unauthorized", {status: 401})
        }

        let userProfile = await prismadb.userProfile.findUnique({
            where: { userId }
        });

        if(!userProfile) {
            return NextResponse.json("User profile not found", {status: 404})
        }

        const updatedProfile = await prismadb.userProfile.update({
            where: {
                userId
            },
            data: {
                appliedJobs: {
                    push: { jobId }
                }
            }
        })

        return NextResponse.json(updatedProfile, { status: 200 });

    } catch (error) {
        console.log(`[APPLIED_JOB_PATCH]: ${error}`)
        return NextResponse.json("Internal server error", {status: 500})
    } 
}