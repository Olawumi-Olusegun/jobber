"use client"

import EditorPreview from "@/components/editor-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Company, Job } from "@prisma/client";
import JobsTabContent from "./jobs-tab-content";


interface TabContentSectionProps {
    userId: string | null;
    company: Company;
    jobs: Job[];
}

const TabContentSection = ({userId, company, jobs}: TabContentSectionProps) => {
  return (
    <div className="w-full my-4 mt-12">
        <Tabs defaultValue="overwiew" className="w-full">
        <TabsList className="bg-transparent">
            <TabsTrigger value="overwiew" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-none bg-transparent text-base font-sans tracking-wider shadow-none">Overview</TabsTrigger>
            <TabsTrigger value="joinus" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-none bg-transparent text-base font-sans tracking-wider shadow-none">Why Join Us</TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:border-b-2 data-[state=active]:border-purple-400 rounded-none bg-transparent text-base font-sans tracking-wider shadow-none">Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="overwiew">
            {company.overview ? <EditorPreview value={company.overview} />  : null}
        </TabsContent>
        <TabsContent value="joinus">
            {company.whyJoinUs ? <EditorPreview value={company.whyJoinUs} /> : null }
        </TabsContent>
        <TabsContent value="jobs">
            <JobsTabContent jobs={jobs} userId={userId} />
        </TabsContent>
       
        </Tabs>
    </div>
  )
}

export default TabContentSection