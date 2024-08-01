"use client"

import { cn } from "@/lib/utils";
import { ColumnDef,  } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ImageIcon, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export type CompanyColumns = {
  id: string
  name: string;
  logo: string;
  createdAt: string;
}

export const columns: ColumnDef<CompanyColumns>[] = [
    {
        accessorKey: "logo",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Logo
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
        cell: ({row}) => {
            const {logo} = row.original;
            return (
                <div className={cn("w-20 h-20 flex items-center justify-center relative rounded-md overflow-hidden")}>
                    { logo 
                    ? <Image src={logo} alt="company logo" fill className="w-full h-full object-contain" />
                    : <ImageIcon className="w-20 h-20 text-neutral-500" />
                    }
                </div>
            )
        }
      },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CreatedAt
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },

  {
    header: "Actions",
    id: "actions",
    cell: ({row}) => {
        const { id } = row.original;
        return (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/admin/companies/${id}`}>
                    <DropdownMenuItem className="cursor-pointer">
                        <Pencil className="h-4 w-4 mr-2" /> Edit 
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  }
]
