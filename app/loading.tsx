export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="skeleton-shimmer h-10 w-40 rounded-full" />
          <div className="flex gap-3">
            <div className="skeleton-shimmer h-10 w-24 rounded-full" />
            <div className="skeleton-shimmer h-10 w-32 rounded-full" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.22)]">
            <div className="skeleton-shimmer h-4 w-32 rounded-full" />
            <div className="skeleton-shimmer h-12 w-4/5 rounded-[1.5rem]" />
            <div className="skeleton-shimmer h-5 w-full rounded-full" />
            <div className="skeleton-shimmer h-5 w-3/4 rounded-full" />
            <div className="pt-4">
              <div className="skeleton-shimmer h-14 w-full rounded-[1.4rem]" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="skeleton-shimmer h-40 rounded-[1.8rem]" />
            <div className="skeleton-shimmer h-40 rounded-[1.8rem]" />
            <div className="skeleton-shimmer h-56 rounded-[1.8rem] sm:col-span-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
