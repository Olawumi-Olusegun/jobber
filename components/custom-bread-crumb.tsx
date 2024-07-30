"use client"

import React from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Home } from 'lucide-react';

interface CustomBreadCrumbProps {
    breadCrumbPage: string;
    breadCrumbItem?: { link: string; label: string }[];
  }

const CustomBreadCrumb = ({breadCrumbPage, breadCrumbItem}: CustomBreadCrumbProps) => {
  return (
        <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-1 " >
                <Home className='w-3 h-3' /> <span>Home</span>
            </BreadcrumbLink>
            </BreadcrumbItem>

            {
                breadCrumbItem && (
                    breadCrumbItem.map((item, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink href={item.link} className="flex items-center gap-1.5 " >
                                        <Home className='w-3 h-3' /> <span>{item.label}</span>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                        </React.Fragment>
                    ))
                )
            }
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>
            </BreadcrumbItem>

        </BreadcrumbList>
        </Breadcrumb>

  )
}

export default CustomBreadCrumb