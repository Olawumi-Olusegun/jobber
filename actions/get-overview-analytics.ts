import prismadb from "@/lib/prismadb"
import { redirect } from "next/navigation";

export const getTotalJobsOnPortal = async () => {
    const jobs = await prismadb.job.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return jobs.length;
}

export const getTotalJobsOnPortalByUserId = async (userId: string | null) => {
    if(!userId) {
        return 0
    }

    const jobs= await prismadb.job.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc"
        }
    });

    return jobs.length;
}


export const getTotalCompaniesOnPortal = async () => {
    const companies = await prismadb.company.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    return companies.length;
}

export const getTotalCompaniesOnPortalByUserId = async (userId: string | null) => {
    if(!userId) {
        return 0
    }

    const companies= await prismadb.company.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc"
        }
    });

    return companies.length;
}

