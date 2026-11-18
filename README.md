# LV Beauty World

Visiting-card website for **LV Beauty World**, a premium beauty salon in Dortmund-Hörde. German and Ukrainian. Black, white, graphite.

## Run

```bash
npm install
npm run dev                  # https://localhost:4317 and https://<LAN-IP>:4317
npm run dev:http             # plain http, no motion sensor on phones
```

`npm run dev` serves HTTPS with a self-signed certificate from `.cert/` (made on first run by `scripts/dev-cert.sh`). Phones send shake data only over HTTPS. On the phone open `https://<LAN-IP>:4317` and accept the certificate warning once.

```bash
npm run typecheck
npm run lint
npm run build
npm start                    # production, port 4317
```

The contacts page embeds `https://maps.google.com/maps?q=…&output=embed` for the salon address. There is no Maps API key and no map-consent gate. The directions link is `https://www.google.com/maps/dir/?api=1&destination=…&dir_action=navigate` and does not set `origin` or `destination_place_id`. Loading the embed does not decide whether that integration is lawful.

## Where to edit

| What | Path |
| --- | --- |
| Salon facts, address, coords | `src/lib/site.ts` |
| Opening hours | `src/content/schedule.ts` |
| Directions notes (stop, parking — confirmed facts only) | `src/content/directions.ts` |
| UI copy DE/UK | `src/content/messages.ts` |
| Services | `src/content/services.ts` |
| Prices (single source) | `src/content/prices.ts` |
| Team | `src/content/team.ts` |
| Legal texts | `src/content/legal.ts` |
| Logos | `public/brand/` and `brand/originals/` |
| Published photos (EXIF stripped) | `public/photos/` |
| Photo originals | `photos/originals/` |

Routes live under `/de/…` and `/uk/…`. Default language is German. `src/middleware.ts` sends `/` and paths without a language to the one saved in the `lvbw-locale` cookie. The contact card is served at `/api/vcard/de` and `/api/vcard/uk`.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS v4. No analytics.
