
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import JobPublishAction from './_components/job-publish-action';
import { Banner } from '@/components/ui/banner';
import IconBadge from '@/components/icon-badge';
import TitleForm from './_components/title-form';
import CategoryForm from './_components/category-form';
import ImageForm from './_components/image-form';
import ShortDescription from './_components/short-description';

const JobDetailsPage = async ({params}: {params: { jobId: string }}) => {
  const isValidObjectId = /^[0-9a-fA-F]{24}$/;

  if(!isValidObjectId.test(params.jobId)) {
    return redirect("/admin/jobs")
  }

  const { userId } = auth();

  if(!userId) {
    return redirect("/")
  }

  const job = await prismadb.job.findUnique({
    where: { id: params.jobId, userId }
  });

  const categories = await prismadb.category.findMany({
    orderBy: { name: "asc" }
  });

  if(!job) {
    return redirect("/admin/jobs")
  }

  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  const options = categories.map((category) => ({ label: category.name, value: category.id }));

  return (
    <div className='p-6'>
        <Link href={"/admin/jobs"} className="group flex items-center px-3 py-1 text-muted-foreground rounded-sm gap-1 w-max ">
          <ArrowLeft size={20} className='group-hover:-translate-x-1 duration-300' /> <span>Back</span>
        </Link>
        <div className="flex items-center justify-between my-4">
          <div className="flex flex-col gap-y-2">
            <h1 className='text-2xl font-medium'>Job Setup</h1>
            <span className='text-sm text-neutral-500'>Completed Fields {completionText} </span>
          </div>
          <JobPublishAction 
           jobId={params.jobId}
           isPublished={job.isPublished}
           disabled={!isComplete}
          />
        </div>
        {
          !job.isPublished && (
            <Banner
              variant={"warning"}
              label={"This job is Unpublish. It will not be visible in the jobs list"}
            />
          )
        }
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="">
            
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard}  />
              <h2 className='text-xl text-neutral-700 font-medium'>Customize your job</h2>
            </div>

            <TitleForm initialData={job} jobId={job.id} />
            <CategoryForm initialData={job} jobId={job.id} options={options} />
            <ImageForm initialData={job} jobId={job.id} />
            <ShortDescription initialData={job} jobId={job.id}/>
          </div>
        </div>
    </div>
  )
}

export default JobDetailsPage