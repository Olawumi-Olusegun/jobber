"use client"

import { ColumnDef,  } from "@tanstack/react-table"

import { Button } from "@/components/ui/button";
import { ArrowUpDown, File } from "lucide-react";
import Link from "next/link";
import CellActions from "./cell-actions";

export type ApplicantsColumns = {
  id: string
  fullname: string;
  email: string;
  contact: string;
  appliedAt: string;
  resume: string;
  resumeName: string;
}

export const columns: ColumnDef<ApplicantsColumns>[] = [
  {
    accessorKey: "fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fullname
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "contact",
    header: "Resume",
    cell: ({row}) => {
        const { resume, resumeName } = row.original;
        return (
            <Link href={resume} target="_blank" className="flex items-center text-purple-500">
               <File className="w-4 h-4 mr-1 " /> 
               <span className="w-44 truncate">{resumeName}</span>
            </Link>
        )
    }
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
        const { id, fullname, email } = row.original;
        return <CellActions id={id} fullName={fullname} email={email} />
    }
  }
]
