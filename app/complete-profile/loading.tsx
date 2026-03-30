export default function CompleteProfileLoading() {
  return (
    <div className="min-h-screen bg-[#f6f6f8]">
      <div className="border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="skeleton-shimmer h-10 w-36 rounded-full" />
          <div className="skeleton-shimmer h-10 w-24 rounded-full" />
        </div>
      </div>

      <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-3xl rounded-md border border-slate-200 bg-white p-8 shadow-sm lg:max-w-[48rem]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="skeleton-shimmer h-4 w-24 rounded-full" />
              <div className="skeleton-shimmer h-4 w-20 rounded-full" />
            </div>
            <div className="skeleton-shimmer h-2 w-full rounded-full" />
          </div>

          <div className="mt-8 space-y-5">
            <div className="skeleton-shimmer h-5 w-44 rounded-full" />
            <div className="skeleton-shimmer h-20 rounded-[1.2rem]" />
            <div className="grid gap-5 md:grid-cols-2">
              <div className="skeleton-shimmer h-12 rounded-[1rem]" />
              <div className="skeleton-shimmer h-12 rounded-[1rem]" />
              <div className="skeleton-shimmer h-12 rounded-[1rem]" />
              <div className="skeleton-shimmer h-12 rounded-[1rem]" />
            </div>
            <div className="skeleton-shimmer h-12 rounded-[1rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
