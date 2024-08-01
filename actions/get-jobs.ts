import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    yearsOfExperience?: string;
    workMode?: string;
    savedJobs?: boolean;
}

export const getJobs = async ({title, categoryId, createdAtFilter, shiftTiming, yearsOfExperience, workMode, savedJobs}: GetJobs): Promise<Job[]> => {

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

        if(typeof title !== "undefined" || typeof categoryId !== "undefined") {
            query.where = {
                AND: [
                    typeof title !== "undefined" && { 
                        title: {
                            contains: title,
                            mode: "insensitive"
                        }
                     },
                    typeof categoryId !== "undefined" && { 
                        categoryId: {
                            equals: categoryId,
                        }
                     },
                ].filter(Boolean)
            }
        }

        if(createdAtFilter) {
            const currentDate = new Date();
            let startDate: Date;
            switch(createdAtFilter){
                case "today": 
                startDate = new Date(currentDate)
                break;
                case "yesterday":
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() - 1);
                    break;
                case "thisWeek":
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() - currentDate.getDate());
                    break;
                case "lastWeek":
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() - currentDate.getDate() - 7);
                    break;
                case "thisMonth":
                    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    break;

                default:
                    startDate = new Date(0)
            }

            query.where.createdAt = {
                gte: startDate
            }
        }

        if(shiftTiming) {
            let formattedShiftTiming = shiftTiming?.split(",")
            if(formattedShiftTiming && formattedShiftTiming.length > 0) {
                query.where.shiftTiming = {
                    in: formattedShiftTiming
                }
            }
        }

        if(workMode) {
            let formattedWorkMode = workMode?.split(",")
            if(formattedWorkMode && formattedWorkMode.length > 0) {
                query.where.workMode = {
                    in: formattedWorkMode
                }
            }
        }

        if(yearsOfExperience) {
            let formattedYearsOfExperience = yearsOfExperience?.split(",")
            if(formattedYearsOfExperience && formattedYearsOfExperience.length > 0) {
                query.where.yearsOfExperience = {
                    in: formattedYearsOfExperience
                }
            }
        }

        if(savedJobs) {
            query.where.savedUsers = {
                has: userId
            }
        }

        const jobs = await prismadb.job.findMany(query);

        return jobs;
        
    } catch (error) {
        return []
    }


}