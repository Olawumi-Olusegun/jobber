"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Company, Job } from "@prisma/client";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import TabContentSection from "./tab-content-section";


interface CompanyDetailContentPageProps {
    userId: string | null;
    company: Company;
    jobs: Job[];
}


const CompanyDetailContentPage = ({userId, company, jobs}: CompanyDetailContentPageProps) => {
    
    const [isFollowing, setIsFollowing] = useState(false);

    const router = useRouter();

    const isFollower = userId && company?.followers?.includes(userId);

    const handleOnClickFollower = async () => {
        try {
            setIsFollowing(true)
            if(isFollower) {
                await axios.patch(`/api/companies/${company.id}/remove-follower`)
                toast.success("Un-followed")
            } else {
                await axios.patch(`/api/companies/${company.id}/add-follower`)
                toast.success("Following")
            }
        } catch (error) {
            toast.error((error as Error)?.message)
        } finally {
            setIsFollowing(false)
            router.refresh();
        }
    }

    return (
    <div className="w-full rounded-2xl bg-white p-4 z-50 -mt-8">
        <div className="w-full flex flex-col px-4">
            <div className="w-full flex items-center justify-between flex-wrap -mt-12 gap-3">
                <div className="py-2 flex flex-col lg:flex-row lg:items-end lg:justify-end gap-3 space-x-4">
                    {
                        company?.logo && (
                            <div className="aspect-square w-max bg-white h-32 rounded-2xl border flex items-center justify-center relative overflow-hidden p-3">
                                <Image 
                                 src={company?.logo}
                                 alt={`${company?.name}-logo`}
                                 width={120}
                                 height={120}
                                 className="object-contain object-center pointer-events-none"
                                /> 
                            </div>
                        )
                    }
                    <div className="flex flex-col space-y-1 ">
                        <div className="flex flex-row items-center gap-2">
                            <h2 className="text-xl font-sans font-bold text-neutral-700 capitalize">{company?.name}</h2>
                            <p className="text-muted-foreground text-sm">
                                {company?.followers?.length 
                                    ?`(${company?.followers?.length}) following` 
                                    : "N/A"
                                }
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground py-2">
                            Leverage Technology to Provide Better Service
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="border px-2 py-1 text-sm text-muted-foreground whitespace-nowrap rounded-lg">Management Consulting</p>
                            <p className="border px-2 py-1 text-sm text-muted-foreground whitespace-nowrap rounded-lg">IT Services and Consulting</p>
                            <p className="border px-2 py-1 text-sm text-muted-foreground whitespace-nowrap rounded-lg">Private </p>
                            <p className="border px-2 py-1 text-sm text-muted-foreground whitespace-nowrap rounded-lg">Corporate </p>
                            <p className="border px-2 py-1 text-sm text-muted-foreground whitespace-nowrap rounded-lg">B2B </p>
                        </div>
                    </div>
                </div>

                <Button
                variant={"ghost"}
                onClick={handleOnClickFollower}
                className={cn("rounded-full flex items-center justify-center border text-purple-500 hover:text-purple-700 border-purple-500", !isFollower && "bg-purple-600 hover:bg-purple-700 hover:text-white text-white")}>
                    {isFollowing && <Loader2 className={cn("h-4 w-4 mr-1 animate-spin", !isFollower ? "text-white" : " text-purple-500")} /> } 
                    {isFollower 
                    ? <span className="flex items-center gap-1.5">Unfollow</span>
                    : <span className="flex items-center gap-1.5">{!isFollowing && <Plus className="h-4 w-4" />} Follow</span>
                    }
                </Button>

            </div>
        </div>

        <TabContentSection userId={userId} company={company} jobs={jobs} />

    </div>
  )
}

export default CompanyDetailContentPage