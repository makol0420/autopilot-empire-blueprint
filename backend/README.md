# SaaS Backend (Express + Prisma + Stripe)

## Local development

1. Copy env

```
cp .env.example .env
```

2. Start Postgres and update `DATABASE_URL` accordingly.

3. Install deps and generate Prisma client

```
npm ci
npx prisma generate
```

4. Apply migrations

```
npx prisma migrate dev --name init
```

5. Run dev server

```
npm run dev
```

- Swagger docs at `/api/docs`
- Health check at `/api/health`

## Stripe webhooks
Expose server or use Stripe CLI:

```
stripe listen --forward-to localhost:4000/api/billing/webhook
```

## Migrations in deploy
`npm start` runs `prisma migrate deploy` before starting the server.