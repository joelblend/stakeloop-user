import { LandingIcon } from "@/components/landing/icon";

type SiteLogoProps = {
  compact?: boolean;
};

export function SiteLogo({ compact = false }: SiteLogoProps) {
  return (
    <span className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/10">
        <LandingIcon className="size-5" name="loop" />
      </span>
      {!compact ? (
        <span className="text-lg font-extrabold tracking-tight text-slate-950">
          StakeLoop
        </span>
      ) : null}
    </span>
  );
}
