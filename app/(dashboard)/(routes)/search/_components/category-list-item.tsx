import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from 'query-string';

interface CategoryListItemProps {
    label: string;
    value: string;
  }

const CategoryListItem = ({label, value}: CategoryListItemProps) => {
    
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const handleClick = () => {
        
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value,
            }
        }, 
        {
            skipNull: true,
            skipEmptyString: true
        });

        router.push(url)
    }

  return (
    <>
    <Button 
    type="button"
    variant={"outline"}
    onClick={handleClick}
    className={cn("whitespace-nowrap text-sm tracking-wider text-muted-foreground border px-2 py-[2px] rounded-md hover:bg-purple-700 hover:text-white duration-300", isSelected && "bg-purple-700 text-white ")}
    >
        {label}
    </Button>
    </>
  )
}

export default CategoryListItem