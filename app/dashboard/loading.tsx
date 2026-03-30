export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] gap-6">
        <aside className="hidden w-[250px] shrink-0 rounded-[2rem] border border-slate-200 bg-[#fbfcff] p-4 lg:block">
          <div className="space-y-4">
            <div className="skeleton-shimmer h-10 w-32 rounded-full" />
            <div className="skeleton-shimmer h-20 rounded-[1.4rem]" />
            <div className="skeleton-shimmer h-20 rounded-[1.4rem]" />
            <div className="skeleton-shimmer h-20 rounded-[1.4rem]" />
            <div className="skeleton-shimmer h-14 rounded-[1.2rem]" />
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-[0_18px_44px_-34px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between gap-4">
              <div className="skeleton-shimmer h-11 w-48 rounded-full" />
              <div className="skeleton-shimmer h-11 w-64 rounded-full" />
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.6fr_0.7fr]">
            <div className="space-y-5">
              <div className="skeleton-shimmer h-36 rounded-[1.8rem]" />
              <div className="skeleton-shimmer h-[24rem] rounded-[1.9rem]" />
              <div className="skeleton-shimmer h-[16rem] rounded-[1.9rem]" />
            </div>
            <div className="space-y-5">
              <div className="skeleton-shimmer h-64 rounded-[1.8rem]" />
              <div className="skeleton-shimmer h-40 rounded-[1.8rem]" />
              <div className="skeleton-shimmer h-52 rounded-[1.8rem]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
