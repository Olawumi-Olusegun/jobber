import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params: { companyId }}: {params: { companyId: string }}) => {
    try {

        const { userId } = auth();

        if(!userId) {
            return redirect("/sign-in")
        }

        if(!companyId) {
            return new NextResponse("Job ID is missing", {status: 401})
        }

        const company = await prismadb.company.findUnique({
            where: { id: companyId },
        });

        if(!company) {
            return new NextResponse("Company not found", {status: 404})
        }

        const userIndex = company.followers.indexOf(userId);

        let updatedCompany;

        if(userIndex !== -1) {
            updatedCompany = await prismadb.company.update({
                where: { id: companyId, userId  },
                data: {
                    followers: {
                        set: company.followers.filter((followerId) => followerId !== userId)
                    }
                }
            });
        }

        return  NextResponse.json(updatedCompany, {status: 200})
        
    } catch (error) {
        console.log(`[UNFOLLOW_COMPANY] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}