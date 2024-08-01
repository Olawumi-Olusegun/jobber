"use client";

import React from 'react'
import { Category } from '@prisma/client';
import Box from '@/components/Box';
import { Card } from '@/components/ui/card';
import { iconMapping, IconName } from '@/lib/utils';
import queryString from 'query-string';
import { useRouter } from 'next/navigation';


interface HomeScreenCategoriesContainerProps {
    categories: Category[]
}

interface CategoryListItemCard {
    data: Category;
}

export const Icon = ({name}: {name: IconName;}) => {
    const IconComponent = iconMapping[name];
    return IconComponent ? <IconComponent className='w-5 h-5' /> : null;
}

const CategoryListItemCard = ({data}: CategoryListItemCard) => {

    const router = useRouter();

    const handleItemClick = () => {
        const href = queryString.stringifyUrl({
            url: "/search",
            query: {
                category: data.id || undefined
            }
        });

        router.push(href);
    }

    return (
        <Card title={data.name} onClick={handleItemClick} className='flex items-center gap-2 p-2 text-muted-foreground duration-300 hover:text-purple-500 hover:border-purple-500 cursor-pointer'>
            <Icon name={data.name as IconName} />
            <span className='w-28 truncate whitespace-nowrap'>{data.name}</span>
        </Card>
    )
}

const HomeScreenCategoriesContainer = ({categories}: HomeScreenCategoriesContainerProps) => {
  return (
    <>
        <Box className='flex-col pt-12'>
            <div className="w-full flex flex-wrap items-center justify-center gap-4">
                {
                    categories.map((category) => (
                        <CategoryListItemCard key={category.id} data={category} />
                    ))
                }
            </div>
        </Box>
    </>
  )
}

export default HomeScreenCategoriesContainer