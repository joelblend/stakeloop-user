import type { AuthSessionPayload } from "@/lib/stakeloop-api";

export function getPostAuthRedirect(session: Pick<AuthSessionPayload, "status" | "user">) {
  if (!session.status.email_verified) {
    return session.user.email
      ? `/verify-email?email=${encodeURIComponent(session.user.email)}`
      : "/verify-email";
  }

  if (!session.status.profile_completed) {
    return "/complete-profile";
  }

  return "/dashboard";
}
