# Stakeloop Deployment Readiness Review

Date: 2026-04-30

## Scope

- User frontend: `stakeloop-user`
- Admin frontend: `stakeloop-admin`
- Backend API: `stakeloop-api`

## Current App Features

### User frontend

- Marketing landing page with platform messaging
- Pilot waitlist signup
- Public platform status check
- Visitor analytics tracking
- Registration, login, logout, and session restore
- Email verification flow
- Profile completion flow with bank resolution and avatar selection
- Terms acceptance gate before slot access
- Dashboard overview and performance views
- Slot purchase flow for regular and pro slots
- Payout and wallet reporting widgets
- Two-factor login completion page and proxy route

### Admin frontend

- Admin login with 2FA-aware flow
- Dashboard overview and system analytics screens
- User list and user detail management
- Admin user management
- Slot and offer management screens
- Ticket management, live sync, settlement reconciliation, and history import UI
- Bookie management, accounts, shops, placements, limits, and allocation tools
- Transaction management
- Profit, payout, and performance reporting screens
- Martingale engine helper tools

### Backend API

- Health check endpoint
- Pilot waitlist ingestion
- Visitor analytics ingestion
- User auth, logout, session lookup, and onboarding status
- Email verification and verification resend
- User 2FA setup, enable, disable, and login verification
- Bank list lookup and account-name resolution
- User profile completion and profile retrieval
- Slot offer lookup, slot purchase, and purchase history
- Admin dashboard, operations, and system analytics endpoints
- Admin user, bookie, ticket, transaction, and profit-management endpoints
- Scheduled jobs for expired offers, ticket settlement, and martingale day close

## Highest Priority Deployment Gaps

1. Lock down user routes after 2FA is enabled.
   The backend currently issues a `pending_2fa` token during login, but normal authenticated user routes are not separated from fully verified sessions.

2. Replace logged mail delivery in production templates.
   The current DigitalOcean template still uses `MAIL_MAILER=log`, which will break real email verification and welcome mail unless overridden at deploy time.

3. Remove fake or fallback banking behavior from production paths.
   `resolveBank()` falls back to a synthetic account name when Paystack is not configured. That is acceptable for tests but not for a live payout setup.

4. Move the admin app away from `localStorage` session handling.
   The admin frontend still stores bearer tokens and user session data in browser storage instead of using an HTTP-only cookie or server-side proxy pattern.

5. Make backend tests self-contained before release.
   The test suite is configured for in-memory SQLite, but it still attempts to connect to MySQL in practice, so CI confidence is currently weak.

## Still Needs Work

### Product and UX

- Wire the admin settings page to real APIs or remove it from production navigation until it is functional
- Add recovery and failure UX around 2FA lockouts, expired sessions, and support workflows
- Confirm payout, capital return, and slot-purchase edge cases with product rules

### Security and reliability

- Enforce token abilities or a dedicated middleware boundary between `pending_2fa` and fully authenticated sessions
- Audit all admin-only UI assumptions that currently trust local storage state
- Add stronger environment validation for mail, Paystack, and frontend/backend URL settings
- Decide and document the intended production timezone for scheduled jobs

### Testing and release engineering

- Fix API test bootstrap so feature tests run against SQLite in CI
- Add a deployment checklist covering environment variables, migrations, mail, queue workers, and scheduled jobs
- Verify admin production builds in a writable environment
- Add smoke tests for the end-to-end onboarding path: register, verify email, complete profile, accept terms, buy slot

## Verification Notes

- `stakeloop-user`: `npm run lint` passed
- `stakeloop-user`: `npm run build` passed after fixing a hidden TypeScript issue in the new 2FA verification view
- `stakeloop-admin`: `npm run lint` passed
- `stakeloop-admin`: `npm run build` could not be fully verified here because the sibling repo is read-only in this workspace
- `stakeloop-api`: `php artisan test` fails broadly because tests still try to use MySQL instead of the SQLite settings declared in `phpunit.xml`
