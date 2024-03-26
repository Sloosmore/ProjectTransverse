import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonLoad() {
  return (
    <div className="flex flex-col space-y-3 w-full">
      <div className="space-y-3">
        <Skeleton className="h-4 w-11/12 bg-gray-400" />
        <Skeleton className="h-4 w-3/4 bg-gray-400" />
        <Skeleton className="h-4 w-5/12 bg-gray-400" />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 w-full">
      <div className="space-y-3">
        <Skeleton className=" h-[125px] w-[250px] bg-gray-400" />
      </div>
    </div>
  );
}
