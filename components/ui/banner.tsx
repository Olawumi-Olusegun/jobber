
import React from 'react'
import { AlertTriangle, CheckCircle } from "lucide-react";
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';


const bannerVariants = cva("border text-center p-4 text-sm flex items-center w-full rounded-md", 
    {
        variants: {
            variant: {
                warning: "bg-yellow-200/80 border-yellow-300 text-primary",
                success: "bg-emerald-700/80 border-emerald-300 text-white/80",
            }
        },
        defaultVariants: {
            variant: "warning"
        }
    });

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircle,
}

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string;
}


export const Banner = ({variant, label}: BannerProps) => {
    const Icon = iconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({variant}))}>
        <Icon className='h-4 w-4 mr-2 shrink-0 ' />
        <span className='text-left'>{label}</span>
    </div>
  )
}
