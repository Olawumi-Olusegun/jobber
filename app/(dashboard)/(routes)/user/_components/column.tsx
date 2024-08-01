"use client"

import { cn } from "@/lib/utils";
import { ColumnDef,  } from "@tanstack/react-table"

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";


export type AppliedJobColumns = {
  id: string
  title: string;
  company: string;
  category: string;
  appliedAt: string | Date;
}

export const columns: ColumnDef<AppliedJobColumns>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
      },
  {
    accessorKey: "company",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },

  {
    accessorKey: "appliedAt",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Applied At
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
           <Button asChild variant={"ghost"} size={"icon"} className="w-8 h-8">
             <Link href={`/search/${id}`} >
                <Eye className="w-4 h-4" />
             </Link>
           </Button>
        )
    }
  }
]
