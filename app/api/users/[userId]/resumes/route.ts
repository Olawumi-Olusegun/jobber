import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { Resumes } from "@prisma/client";
import { NextResponse } from "next/server";


export const POST = async (req: Request) => {

    try {

        const { userId } = auth();
        const {resumes} = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }


        if(!resumes || !Array.isArray(resumes)) {
            return new NextResponse("Invalid resume format", {status: 400})
        }

        const createResume: Resumes[] = [];

        for (const resume of resumes) {
            const { url, name } = resume;

            // if(!url || !name) {
            //     continue;
            // }

            const existingResume = await prismadb.resumes.findFirst({
                where: {
                    userProfileId: userId,
                    url,
                }
            });

            if(existingResume) {
                console.log(`Resume with URL: ${url} already exist`)
                continue;
            }

            const createdResume = await prismadb.resumes.create({
                data:{
                    url,
                    name,
                    userProfileId: userId,
                }
            })

            createResume.push(createdResume)
        }

        return  NextResponse.json(createResume, {status: 200})

    } catch (error) {
        console.log(`[USER_RESUME_POST] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}