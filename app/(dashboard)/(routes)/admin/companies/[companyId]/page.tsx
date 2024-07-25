
import IconBadge from '@/components/icon-badge';
import { Banner } from '@/components/ui/banner';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, LayoutDashboard, ListCheck, Network } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import NameForm from './_components/name-form';
import DescriptionForm from './_components/description-form';
import LogoForm from './_components/logo-form';
import CompanySocialContactForm from './_components/social-contact-form';
import CompanyCoverImageForm from './_components/cover-image-form';
import CompanyDescription from './_components/company-overview';
import WhyJoinUs from './_components/why-join-us';


const CompanyDetailsPage = async ({params}: {params: { companyId: string }}) => {
  const isValidObjectId = /^[0-9a-fA-F]{24}$/;

  if(!isValidObjectId.test(params.companyId)) {
    return redirect("/admin/jobs")
  }

  const { userId } = auth();

  if(!userId) {
    return redirect("/")
  }

  const company = await prismadb.company.findUnique({
    where: { id: params.companyId, userId }
  });

  const categories = await prismadb.category.findMany({
    orderBy: { name: "asc" }
  });

  if(!company) {
    return redirect("/admin/companies")
  }

  const requiredFields = [
    company.name,
    company.logo,
    company.description,
    company.coverImage,
    company.mail,
    company.website,
    company.linkedIn,
    company.address_line_1,
    company.address_line_2,
    company.city,
    company.state,
    company.state,
    company.overview,
    company.whyJoinUs,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  const options = categories.map((category) => ({ label: category.name, value: category.id }));

  return (
    <div className='p-6'>
        <Link href={"/admin/companies"} className="group flex items-center px-3 py-1 text-muted-foreground rounded-sm gap-1 w-max ">
          <ArrowLeft size={20} className='group-hover:-translate-x-1 duration-300' /> <span>Back</span>
        </Link>
        <div className="flex items-center justify-between my-4">
          <div className="flex flex-col gap-y-2">
            <h1 className='text-2xl font-medium'>Company Setup</h1>
            <span className='text-sm text-neutral-500'>Completed Fields {completionText} </span>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard}  />
              <h2 className='text-xl text-neutral-700 font-medium'>Customize your job</h2>
            </div>

            <NameForm initialData={company} companyId={company.id} />
            <DescriptionForm initialData={company} companyId={company.id} />
            <LogoForm initialData={company} companyId={company.id} />

          </div>
          
          <div className="space-y-6 col-span-2 md:col-span-1">
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Network} />
                <h2 className='text-xl text-neutral-700 font-medium'>Company Requirements</h2>
              </div>
              
              <CompanySocialContactForm  initialData={company} companyId={company.id} />
              <CompanyCoverImageForm  initialData={company} companyId={company.id} />

            </div>
          </div>

          <div className="col-span-2">
            <CompanyDescription  initialData={company} companyId={company.id} />
          </div>

          <div className="col-span-2">
            <WhyJoinUs  initialData={company} companyId={company.id} />
          </div>

        </div>
    </div>
  )
}

export default CompanyDetailsPage