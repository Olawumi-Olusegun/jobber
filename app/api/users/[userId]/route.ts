import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request) => {
    try {
        
        const { userId } = auth();

        const values = await request.json();
        
        if(!userId) {
            return NextResponse.json("Unauthorized", {status: 401})
        }

        let profile = await prismadb.userProfile.findUnique({
            where: { userId }
        });

        let userProfile;

        if(profile) {
            userProfile = await prismadb.userProfile.update({
                where: { userId },
                data: { ...values }
            })
        } else {
            userProfile = await prismadb.userProfile.create({
                data: {userId, ...values }
            })
        }

        return NextResponse.json(userProfile, { status: 200 });


    } catch (error) {
        console.log(`[JOB_PUBLISH_PATCH]: ${error}`)
        return NextResponse.json("Internal server error", {status: 500})
    } 
}