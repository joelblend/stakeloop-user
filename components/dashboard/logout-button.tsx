"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LogoutButtonProps = {
  className?: string;
  iconOnly?: boolean;
};

function LogoutIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M10 17 15 12 10 7" />
      <path d="M15 12H4" />
      <path d="M13 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
    </svg>
  );
}

export function LogoutButton({
  className = "",
  iconOnly = false,
}: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    router.prefetch("/login");
  }, [router]);

  return (
    <button
      className={className}
      disabled={isPending}
      onClick={async () => {
        setIsPending(true);

        try {
          await fetch("/api/auth/logout", {
            method: "POST",
          });
        } finally {
          router.replace("/login");
        }
      }}
      type="button"
    >
      <LogoutIcon />
      {iconOnly ? null : <span>{isPending ? "Signing out..." : "Logout"}</span>}
    </button>
  );
}
