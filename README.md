# Stakeloop User

## Local Setup

1. Make sure the API is healthy first:

```bash
cd ../stakeloop-api
composer run local:recover
```

2. Confirm `.env.local` exists. If you are starting fresh:

```bash
cp .env.example .env.local
```

3. Install dependencies and start the app:

```bash
npm install
npm run dev
```

## Local Recovery

Run this when the user app feels out of sync after a branch switch, dependency drift, or Next build-cache weirdness:

```bash
npm run local:recover
```

That command:
- validates the required `.env.local` keys
- clears the local `.next` cache
- runs `npm install`
- runs `npm run lint`
- runs `npm run build`

Required env keys:
- `STAKELOOP_API_BASE_URL`

For Vercel production, set `STAKELOOP_API_BASE_URL` to the DigitalOcean API URL, for example `https://api.stakeloop.io`.

If dashboard/auth behavior looks wrong because the backend database was reset, recover the API first and then rerun this user recovery command.
