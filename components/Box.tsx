"use client"

import React, { ComponentPropsWithRef } from "react"
import { cn } from "@/lib/utils"

interface BoxProps extends ComponentPropsWithRef<"div"> {}

const Box = ({children, className, ...props}: BoxProps) => {
  return (
    <div className={cn("flex items-center justify-between w-full", className)} {...props}>
        {children}
    </div>
  )
}

export default Box