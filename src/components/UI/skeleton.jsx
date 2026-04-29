import Skeleton from "@mui/material/Skeleton";

export default function MenuCardSkeleton () {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      {/* Image */}
      <Skeleton variant="rectangular" height={224} />

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="w-full">
            <Skeleton variant="text" width="70%" height={30} />
            <Skeleton variant="text" width="40%" />
          </div>

          <Skeleton variant="rounded" width={60} height={30} />
        </div>

        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />

        <Skeleton variant="rounded" width={120} height={35} />
      </div>
    </div>
  );
}



