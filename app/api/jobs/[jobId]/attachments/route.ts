import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { Attachment } from "@prisma/client";
import { NextResponse } from "next/server";


export const POST = async (req: Request, { params: { jobId }}: {params: { jobId: string }}) => {

    try {

        const { userId } = auth();
        const {attachments} = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!jobId) {
            return new NextResponse("Job ID is missing", {status: 401})
        }

        if(!attachments || !Array.isArray(attachments)) {
            return new NextResponse("Invalid attachment format", {status: 400})
        }

        const createAttachments: Attachment[] = [];

        for (const attachment of attachments) {
            const { url, name } = attachment;

            // if(!url || !name) {
            //     continue;
            // }

            const existingAttachment = await prismadb.attachment.findFirst({
                where: {
                    jobId,
                    url,
                }
            });

            if(existingAttachment) {
                console.log(`Attachment with URL: ${url} already exist`)
                continue;
            }

            const createdAttachment = await prismadb.attachment.create({
                data:{
                    url,
                    name,
                    jobId,
                }
            })

            createAttachments.push(createdAttachment)
        }

        return  NextResponse.json(createAttachments, {status: 200})

    } catch (error) {
        console.log(`[JOB_ATTACHMENT_POST] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}