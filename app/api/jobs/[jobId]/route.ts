import { storage } from "@/config/firebase";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { Attachment } from "@prisma/client";
import { deleteObject, ref } from "firebase/storage";
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
        console.log(`[JOB_PATCH] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}

export const DELETE = async (req: Request, { params: { jobId }}: {params: { jobId: string }}) => {
    try {

        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!jobId) {
            return new NextResponse("Job ID is missing", {status: 401})
        }

        const job = await prismadb.job.findUnique({
            where: { id: jobId, userId },
            include: {
                attachments: {
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });

        if(!job) {
            return new NextResponse("Job not found", {status: 404})
        }

        if(job.imageUrl) {
            const storageRef = ref(storage, job.imageUrl);
            await deleteObject(storageRef)
        }

        if(Array.isArray(job.attachments) && job.attachments.length > 0) {

            await Promise.all([
                job.attachments.map(async(attachment: Attachment) => {
                    const attachmentStorageRef = ref(storage, attachment.url);
                    await deleteObject(attachmentStorageRef)
                })
            ])

        }

        await prismadb.attachment.deleteMany({
            where: { jobId },
        });

        const deletedJob = await prismadb.job.delete({
            where: { id: jobId, userId },
        });

        return  NextResponse.json(deletedJob, {status: 200})
        
    } catch (error) {
        console.log(`[JOB_PATCH] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}