import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
    title?: string;
    categoryId?: string;
    createdAt?: string;
    shiftTiming?: string;
    yearsOfExperience?: string;
    workMode?: string;
    savedJobs?: boolean;
}

export const getJobs = async ({title, categoryId, createdAt, shiftTiming, yearsOfExperience, workMode, savedJobs}: GetJobs): Promise<Job[]> => {

    const { userId } = auth();

    try {

        let query: any = {
            where: {
                isPublished: true,
            },
            include: {
                company: true,
                category: true,
                attachments: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        }

        const jobs = await prismadb.job.findMany(query);

        console.log(jobs[0].savedUsers)

        return jobs;
        
    } catch (error) {
        return []
    }


}