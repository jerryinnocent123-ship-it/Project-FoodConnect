import Skeleton from "@mui/material/Skeleton";


export default function RestaurantSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="w-full space-y-2">
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="70%" />
        </div>

        <Skeleton variant="circular" width={40} height={40} />
      </div>

      <Skeleton variant="rounded" width={120} height={35} />
    </div>
  );
}
