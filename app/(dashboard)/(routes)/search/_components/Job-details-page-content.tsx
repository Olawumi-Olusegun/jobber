"use client";

import ApplyModal from "@/components/ApplyModal";
import Box from "@/components/Box";
import CustomBreadCrumb from "@/components/custom-bread-crumb";
import EditorPreview from "@/components/editor-preview";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Attachment, Company, Job, Resumes, UserProfile } from "@prisma/client";
import axios from "axios";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface JobDetailsPageContentProps {
  job: Job & { company: Company | null, attachments: Attachment[] };
  jobId: string;
  userProfile: UserProfile & { resumes: Resumes[] } | null;
}

const JobDetailsPageContent = ({job, jobId, userProfile}: JobDetailsPageContentProps) => {

  const [isApplyLoading, setIsApplyLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const isAppliedJobs = userProfile && userProfile?.appliedJobs.some((appliedJob) => appliedJob.jobId === jobId);

  const onAppliedJob = async () => {
    
    if(!userProfile?.userId) {
      router.replace("/sign-in")
      return;
    }
    
    if(!jobId) {
      toast.error("Job ID is required")
      return;
    }

    setIsApplyLoading(true);

    try {

      await Promise.all([
        axios.patch(`/api/users/${userProfile?.userId}/appliedJobs`, jobId),

        axios.post(`/api/thank-you/`, {
          fullName: userProfile?.fullName,
          email: userProfile?.email,
        }),
      ])

      toast.success("Job Applied");

    } catch (error) {
       toast.error((error as any)?.message)
    } finally {
      setOpen(false)
      setIsApplyLoading(false)
      router.refresh();
    }
  }

  return (
    <>
    <ApplyModal 
    isOpen={open}
    onClose={() => setOpen(false)}
    onConfirm={onAppliedJob}
    isLoading={isApplyLoading}
    userProfile={userProfile}
    />

    {
      isAppliedJobs && (
        <Banner 
         variant={"success"}
         label="Thank you for applying, your application has been recieved and we're reviewing it carefully. We'll be in touch soon with an update"
         
        />
      )
    }

    <Box className="mt-4">
      <CustomBreadCrumb 
      breadCrumbItem={[ {label: "Search", link: "/search"}, ]} 
      breadCrumbPage={job.title !== undefined ? job.title : ""} 
      />
    </Box>

    <Box className="mt-4">
      <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
        {
          job?.imageUrl 
          ? <Image 
           src={job?.imageUrl}
           alt={job.title}
           fill
           className="object-cover w-full h-full absolute pointer-events-none"
          />
          : <div className="w-full h-full bg-purple-100 flex items-center justify-center">
            <h2 className="text-3xl font-semibold tracking-wider">{job.title}</h2>
          </div>
        }
      </div>
    </Box>

    <Box className="mt-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-neutral-600">{job.title}</h2>
        <Link href={`/companies/${job?.companyId}`}>
          <div className="flex items-center gap-2 mt-2">
            {job?.company?.logo &&  (
              <Image
              src={job?.company?.logo}
              alt={job?.company?.name}
              width={25}
              height={25}
            />
            )}
            <p className="text-muted-foreground text-sm font-semibold">{job?.company?.name}</p>
          </div>
        </Link>
      </div>
      <div className="">
        {
          userProfile
          ? <>
           {
            !userProfile.appliedJobs.some((appliedJob) => appliedJob.jobId === jobId)
              ? <Button onClick={() => setOpen(true)} className="text-sm bg-purple-700 hover:bg-purple-900">
                  Apply
                </Button>
              : <Button variant={"outline"} className="text-sm border-purple-500 text-purple-700 hover:text-purple-900">
                  Already Applied
                </Button>
           }
          </>
          : <Button asChild variant={"outline"} className="text-sm px-8 bg-purple-700 hover:bg-purple-900 hover:shadow-sm" >
              <Link href={"/user"}>Update Profile</Link>
            </Button>
        }
      </div>
    </Box>

    <Box className="flex flex-col my-4 items-start justify-start px-4 gap-2">
      <h2 className="text-lg font-semibold">Description</h2>
      <p className="font-sans">{job.short_desciption}</p>
      {
        job.description && (
          <Box>
            <EditorPreview value={job.description} />
          </Box>
        )
      }
    </Box>

    {
      job.attachments && job.attachments.length > 0 && (
        <Box className="flex flex-col my-4 items-start justify-start px-4 gap-2 ">
            <h2 className="text-lg font-semibold">Description:</h2>
            <p className="py-1">Download the attachment to know more about the job</p>
            {
              job.attachments.map((attachment, index) => (
                <div className="flex items-center gap-4" key={attachment.id}>
                  <span className="self-stretch p-4 rounded-full bg-purple-100 text-purple-700 w-6 h-6 min-h-6 min-w-6 flex items-center justify-center">{index + 1}</span>
                  <div className="flex-1">
                    <Link href={attachment.url} target="_blank" download className="flex items-center gap-2 undeline text-purple-700 hover:underline duration-300" >
                      <FileIcon className="w-4 h-4" />
                      <span>{attachment.name }</span>
                    </Link>
                  </div>
                </div>
              ))
            }
        </Box>
      )
    }


    </>
  )
}

export default JobDetailsPageContent