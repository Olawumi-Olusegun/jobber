"use client"

import { cn } from "@/lib/utils"
import React, { ComponentPropsWithRef } from "react"

interface BoxProps extends ComponentPropsWithRef<"div"> {}

const Box = ({children, className, ...props}: BoxProps) => {
  return (
    <div className={cn("flex items-center justify-between w-full", className)} {...props}>
        {children}
    </div>
  )
}

export default Box