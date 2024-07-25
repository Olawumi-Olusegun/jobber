import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params: { companyId }}: {params: { companyId: string }}) => {
    try {

        const { userId } = auth();

        const updatedValues = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!companyId) {
            return new NextResponse("Job ID is missing", {status: 401})
        }

        const company = await prismadb.company.update({
            where: { id: companyId },
            data: updatedValues
        });

        if(!company) {
            return new NextResponse("Unable to update company", {status: 400})
        }

        return  NextResponse.json(company, {status: 200})
        
    } catch (error) {
        console.log(`[COMPANY_UPDATE] ${error}`)
        return new NextResponse("Internal server error", {status: 500})
    }
}