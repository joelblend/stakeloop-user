import type { AuthSessionPayload } from "@/lib/stakeloop-api";

export function getPostAuthRedirect(session: Pick<AuthSessionPayload, "status" | "user">) {
  if ("requires_2fa" in session && session.requires_2fa) {
    return "/verify-2fa";
  }

  if (!session.status.email_verified) {
    return session.user.email
      ? `/verify-email?email=${encodeURIComponent(session.user.email)}`
      : "/verify-email";
  }

  if (!session.status.profile_completed) {
    return "/complete-profile";
  }

  if (!session.status.terms_accepted) {
    return "/terms-of-use";
  }

  return "/dashboard";
}
