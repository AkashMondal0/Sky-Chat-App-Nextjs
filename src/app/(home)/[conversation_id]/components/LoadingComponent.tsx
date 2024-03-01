import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingComponent = () => {
    return <div className='w-full h-[100dvh] flex flex-col'>
        <div className='flex my-4 px-2 h-16 border-b pb-2'>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className='flex flex-col'>
                <Skeleton className="h-5 w-72 m-1" />
                <Skeleton className="h-4 w-52 m-1" />
            </div>
        </div>
        <ScrollArea className="flex-grow px-4 my-2 w-full">
            {Array(14).fill(0).map((_, i) => <div key={i} className="flex flex-col">
                <Skeleton className={`h-12 w-40 rounded-2xl my-2 
            ${Math.floor(Math.random() * 12) > 6 ? "ml-auto" : ""}`} />
            </div>)}
        </ScrollArea>

        <div className='px-2 h-16 sticky bottom-0 z-1 my-2 border-t pt-2'><Skeleton className="h-10 w-full rounded-3xl" /></div>
    </div>
}

export default LoadingComponent;