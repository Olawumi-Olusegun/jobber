"use client"

import React, { useState } from "react"
import { ChevronsUpDown, Search } from "lucide-react"
import { Button } from "./button"

import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Command, CommandEmpty, CommandGroup, CommandList } from "./command"
import ListItem from "./list-item"

interface ComboBoxProps {
  options: { label: string, value: string}[];
  value?: string;
  onChange: (value: string) => void;
  heading: string;
}

const Combobox = ({options, value, onChange, heading}: ComboBoxProps) =>  {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtered, setFiltered] = useState<{label: string, value: string}[]>([])
 
 
  const handleSearchTerm = (event: any) => {
    setSearchTerm(event.target.value)
    setFiltered(options.filter((item) => item.label.toLowerCase().includes(searchTerm.toLowerCase())));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select option..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:min-w-96">
        
        <Command>
          <div className="w-full px-2 py-1 flex items-center borer rounded-md">
              <Search className="mr-2 h-4 w-4 text-gray-500" />
              <input onChange={handleSearchTerm} placeholder="Search category..." className="flex-1 w-full text-gray-700 outline-none border-none text-sm py-1" />
          </div>

          <CommandList>
            <CommandGroup heading={heading} className="py-2">
              {
                searchTerm === ""
                ? options.map((option) => (
                  <ListItem 
                  key={option.value}
                  category={option}
                  onSelect={()  => {
                   onChange(option.value === value ? "" : option.value);
                   setOpen(false);
                  }}
                  isChecked = {option?.value === value}
                 />
                ))
                : filtered.length > 0 
                ? (
                  filtered.map((filter) => (
                    <ListItem 
                     key={filter.value}
                     category={filter}
                     onSelect={()  => {
                      onChange(filter.value === value ? "" : filter.value)
                      setOpen(false)
                     }}
                     isChecked = {filter?.value === value}
                    />
                  ))
                ) 
                : <CommandEmpty>No category found.</CommandEmpty>
              }
            </CommandGroup>
          </CommandList>
        </Command>
        

      </PopoverContent>
    </Popover>
  )
}

export default Combobox