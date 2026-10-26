# LV Beauty World

Visiting-card website for **LV Beauty World**, a premium beauty salon in Dortmund-Hörde. German and Ukrainian. Black, white, graphite.

## Run

```bash
npm install
cp .env.example .env.local   # optional: MAPKIT_TOKEN
npm run dev                  # http://localhost:4317
```

```bash
npm run typecheck
npm run lint
npm run build
npm start                    # production, port 4317
```

Apple MapKit: create a Maps JS token in Apple Developer, put it in `MAPKIT_TOKEN`. Never commit it. The map loads only after consent on the contact page. Without a token, address and route links still work.

## Where to edit

| What | Path |
| --- | --- |
| Salon facts, address, hours, coords | `src/lib/site.ts` |
| UI copy DE/UK | `src/content/messages.ts` |
| Services | `src/content/services.ts` |
| Prices (single source) | `src/content/prices.ts` |
| Team | `src/content/team.ts` |
| Legal texts | `src/content/legal.ts` |
| Logos | `public/brand/` and `brand/originals/` |
| Published photos (EXIF stripped) | `public/photos/` |
| Photo originals | `photos/originals/` |

Routes live under `/de/…` and `/uk/…`. Default language is German.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS v4. No analytics.
