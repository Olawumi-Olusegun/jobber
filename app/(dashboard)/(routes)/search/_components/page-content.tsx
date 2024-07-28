"use client";

import { Job } from "@prisma/client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion"
import JobCardItem from "./jobcard-item";
import { fadeInOut } from "@/animations";

interface PageContentProps {
    jobs: Job[];
    userId: string | null;
}

const PageContent = ({jobs, userId}: PageContentProps) => {

    

    if(jobs.length === 0) {
        return <div className="flex items-center justify-center flex-col">
            <div className="w-full h-[60vh] relative flex flex-col gap-y-4 items-center justify-center">
               
                <div className="w-full">
                    <Image 
                    fill
                    src={"/images/404.jpg"} 
                    alt="notfound svg"
                    className="object-contain"
                    />
                </div>
            </div>
            <h2 className="text-4xl w-full text-center font-semibold text-muted-foreground">No Job found!</h2>
        </div>
    }

  return (
    <div className="my-6">
        <AnimatePresence mode="wait" >
            <motion.div
            {...fadeInOut}
            layout={true}
            
            className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-6 gap-2">
                {jobs.map((job) => (
                    <JobCardItem key={job.id} job={job} userId={userId} />
                ))}
            </motion.div>
        </AnimatePresence>
    </div>
  )
}

export default PageContent