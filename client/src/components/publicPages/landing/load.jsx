import { Skeleton } from "@/components/ui/skeleton";

function LoadLine() {
  return (
    <div className="gap-y-3 w-full flex flex-col ">
      <Skeleton className={"h-4 w-full bg-gray-300"} />
      <Skeleton className={`h-4 w-5/6 bg-gray-300`} />
      <Skeleton className={`h-4 w-11/12 bg-gray-300`} />
      <Skeleton className={"h-4 w-2/3 bg-gray-300"} />
    </div>
  );
}

export default LoadLine;
