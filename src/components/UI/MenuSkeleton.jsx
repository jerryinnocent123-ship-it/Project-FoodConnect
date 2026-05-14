import Skeleton from "@mui/material/Skeleton";

export default function MenuSkeleton () {
  return (
    <div className="overflow-hidden rounded-3xl bg-white/10 backdrop-blur">
      <div className="grid gap-4 md:grid-cols-[140px_1fr]">
        <Skeleton variant="rectangular" height={140} />

        <div className="p-4 space-y-2 w-full">
          <div className="flex justify-between">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="rounded" width={50} height={25} />
          </div>

          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />

          <Skeleton variant="rounded" width={120} height={35} />
        </div>
      </div>
    </div>
  );
}