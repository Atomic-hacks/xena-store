# Xena Store

Minimal Next.js + Prisma storefront with:
- product catalog and filters
- admin product/category management
- Cloudinary-backed image uploads
- cookie-based cart and checkout profile sessions
- WhatsApp checkout link generation

## Environment

Create `.env`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/xena_store?schema=public"
WHATSAPP_NUMBER="2348012345678"
SESSION_SECRET="long_random_secret_value"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="change-me"
DEBUG="false"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_UPLOAD_FOLDER="xena-store"
CLOUDINARY_MAX_UPLOAD_MB="8"
```

## Local Setup

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
```

## Production Checklist

1. Use PostgreSQL for all non-trivial environments.
2. Set a strong `SESSION_SECRET` (32+ random bytes).
3. Set `NODE_ENV=production` so session cookies are `secure`.
4. Configure Cloudinary keys and verify uploads from `/admin/products/new`.
5. Set `WHATSAPP_NUMBER` in international format (digits only preferred).
6. Run DB migration in deployment pipeline:
   - `pnpm prisma:generate`
   - `pnpm prisma migrate deploy`
7. Build and start:
   - `pnpm build`
   - `pnpm start`
8. Configure backups for your production database.
9. Restrict admin credentials and rotate regularly.
10. Keep `DEBUG=false` in production.

## Key Flows

- Admin login: `/admin/login`
- Add products: `/admin/products/new`
- Edit products: `/admin/products/:id/edit`
- Checkout profile + checkout: `/checkout`
- Customer account/history: `/account`

## Notes

- No `localStorage`/`sessionStorage` is used for cart/auth.
- Customer profile persistence is cookie-session based and linked to DB records.
- Checkout history totals are saved per customer in `OrderIntent`.
