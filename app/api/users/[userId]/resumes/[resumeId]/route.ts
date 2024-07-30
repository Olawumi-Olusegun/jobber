import { storage } from "@/config/firebase";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";


export const DELETE = async (req: Request, { params: { resumeId }}: {params: { resumeId: string; attachmentId: string; }}) => {
    try {

        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!resumeId) {
            return new NextResponse("Resume ID is missing", {status: 401})
        }

        const resume = await prismadb.resumes.findUnique({
            where: {
                id: resumeId,
            }
        });


        if(!resume || resume?.id !== resumeId) {
            return new NextResponse("Resume not found", {status: 404})
        }

        const storageRef = ref(storage, resume.url);

        await deleteObject(storageRef)

        await prismadb.resumes.delete({
            where: {
                id: resumeId
            }
        });

        return  NextResponse.json({message: "Resume deleted"}, {status: 200})

    } catch (error) {
        console.log(`[USER_RESUME_DELETE] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}