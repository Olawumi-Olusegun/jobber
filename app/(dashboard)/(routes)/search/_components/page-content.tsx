"use client";

import { Job } from "@prisma/client";
import Image from "next/image";

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
    <div>PageContent</div>
  )
}

export default PageContent