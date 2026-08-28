# Prego B2B

Tukkutilausportaali (Suomen 585 Oy / Prego). Kirjautuneet asiakkaat selaavat valikoimaa ja lähettävät tilauksen sähköpostitse. Maksua ei peritä verkossa.

## Vercel

Ympäristömuuttujat (Production + Preview + Development):

- `DATABASE_URL` — Neon Postgres
- `BETTER_AUTH_SECRET` — satunnainen merkkijono
- `BETTER_AUTH_URL` — `https://<projekti>.vercel.app` (ilman kauttaviivaa)
- `RESEND_API_KEY` — valinnainen, tilaussähköpostit
- `ORDER_EMAIL_FROM` — valinnainen, esim. `Prego B2B <tilaukset@domain.fi>`

Build: `npm run build`

Ensimmäinen rekisteröity tili on ylläpitäjä. Varasto päivitetään administa Excelillä.
