"use client"

import { Company, Job } from "@prisma/client"
import {motion} from "framer-motion"
import {
    Card,
    CardDescription,
    CardFooter,
  } from "@/components/ui/card"
import Box from "@/components/Box";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Bookmark, BookmarkCheck, BriefcaseBusiness, Currency, Layers, Loader2, Network } from "lucide-react";
import { cn, formattedString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

  

interface JobCardItemProps {
    job: Job;
    userId: string | null;
}

const experienceData = [
    {
      value: "0",
      label: "Fresher",
    },
    {
      value: "2",
      label: "0-2 years",
    },
    {
      value: "3",
      label: "2-4 years",
    },
    {
      value: "5",
      label: "5+ years",
    },
  ];

const JobCardItem = ({job, userId}: JobCardItemProps) => {
    const pathname = usePathname();

    const [isBookmarkLoading, setBookmarkLoading] = useState(false);

    const router = useRouter();

    const isSavedByUser = userId && job.savedUsers?.includes(userId);

    const typeJob = job as Job & { company: Company; }

    const company = typeJob.company;

    const SavedUsersIcon  = isSavedByUser ? BookmarkCheck : Bookmark;


    const handleSavedJob = async () => {
        try {
            setBookmarkLoading(true)
            if(isSavedByUser) {
                await axios.patch(`/api/jobs/${job.id}/remove-job-from-collection`)
                toast.success("Job removed")
            } else {
                await axios.patch(`/api/jobs/${job.id}/save-job-to-collection`)
                toast.success("Job saved")
            }
            router.refresh()
        } catch (error) {
            toast.error((error as any)?.message)
        } finally {
            setBookmarkLoading(false)
        }
    }

    const getExperinceLabel = (value: string) => {
        const experience = experienceData.find((exp) => exp.value === value);
        return experience ? experience.label : "N/A";
    }

  return (
    <motion.div 
    key={pathname}
    layout={true}>
        <Card>
        <div  className="w-full h-full p-4 flex flex-col items-start justify-start gap-y-4">
            <Box>
                <p className="text-sm text-muted-foreground"> {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })} </p>
                <Button onClick={handleSavedJob} type="button" variant={"ghost"} size={"icon"} className="h-8 w-8">
                    {isBookmarkLoading 
                    ? <Loader2 className="h-4 w-4 animate-spin" /> 
                    : <SavedUsersIcon className={cn("w-4 h-4", isSavedByUser ? "text-emerald-500" : "text-muted-foreground")} />
                    }
                </Button>
            </Box>
            <Box className="items-center justify-start gap-x-4">
                <div className="w-12 h-12 min-w-12 min-h-12 border p-2 rounded-md relative flex items-center justify-center overflow-hidden">
                    {
                        company?.logo && (
                            <Image 
                             alt={company?.name}
                             src={company?.logo}
                             width={40}
                             height={40}
                             className="object-contain"
                            />
                        )
                    }
                </div>
                <div className="w-full">
                    <p className="text-stone-700 font-semibold text-base w-full truncate">{job.title}</p>
                    <Link href={`/companies/${company.id}`} className="text-purple-500 w-full truncate">
                        {company.name}
                    </Link>
                </div>
            </Box>

            <Box>
                {job.shiftTiming && (
                    <div className="flex items-center text-xs text-muted-foreground ">
                        <BriefcaseBusiness className="w-3 h-3 mr-1" />
                        {formattedString(job.shiftTiming)}
                    </div>
                )}
                {job.workMode && (
                    <div className="flex items-center text-xs text-muted-foreground ">
                        <Layers className="w-3 h-3 mr-1" />
                        {formattedString(job.workMode)}
                    </div>
                )}
                {job.hourlyRate && (
                    <div className="flex items-center text-xs text-muted-foreground ">
                        <Currency className="w-3 h-3 mr-1" />
                        {formattedString(job.hourlyRate)}$/hr
                    </div>
                )}
                {job.yearsOfExperience && (
                    <div className="flex items-center text-xs text-muted-foreground ">
                        <Network className="w-3 h-3 mr-1" />
                        {getExperinceLabel(job.yearsOfExperience)}
                    </div>
                )}
            </Box>
            {
                job.short_desciption && (
                    <CardDescription className="text-xs line-clamp-3">
                        {job.short_desciption}
                    </CardDescription>
                )
            }
            {
                job.tags.length > 0 && (
                    <Box className="flex-wrap justify-start gap-1">
                        {job.tags.slice(0,6).map((tag, index) => (
                            <p key={index} className="text-xs bg-gray-100 text-neutral-500 rounded-md px-2 py-[2px] font-semibold">{tag}</p>
                        )) }
                    </Box>
                )
            }
        </div>
        <CardFooter>
            <Box className="gap-2 mt-auto">
                <Button asChild variant={"outline"}  className="w-full border-purple-500 border text-purple-500 hover:bg-transparent hover:text-purple-600">
                    <Link href={`/search/${job.id}`} >Details</Link>
                </Button>
                <Button onClick={handleSavedJob} variant={"outline"} type="button"  className="w-full border-purple-500 border text-purple-500 hover:bg-purple-800/90 hover:text-white">
                      { isSavedByUser 
                      ? <span>
                        { isBookmarkLoading ? "Saving..." : "Saved" }
                      </span>
                      : <span>
                        { isBookmarkLoading ? "Saving..." : "Save For Later" }
                      </span>
                      }  
                </Button>
            </Box>
        </CardFooter>
        </Card>
    </motion.div>
  )
}

export default JobCardItem