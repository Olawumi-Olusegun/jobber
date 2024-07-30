import { storage } from "@/config/firebase";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const DELETE = async (req: Request, { params: { jobId, attachmentId }}: {params: { jobId: string; attachmentId: string; }}) => {
    try {

        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!jobId) {
            return new NextResponse("Job ID is missing", {status: 401})
        }

        if(!attachmentId) {
            return new NextResponse("Job attachmentId ID is missing", {status: 401})
        }

        const attachment = await prismadb.attachment.findUnique({
            where: {
                id: attachmentId,
            }
        });

        if(!attachment || attachment.jobId !== jobId) {
            return new NextResponse("Attachment not found", {status: 404})
        }

        const storageRef = ref(storage, attachment.url);

        await deleteObject(storageRef)

        await prismadb.attachment.delete({
            where: {
                id: attachmentId
            }
        });

        return  NextResponse.json({message: "Attachment deleted"}, {status: 200})

    } catch (error) {
        console.log(`[JOB_ATTACHMENT_DELETE] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}