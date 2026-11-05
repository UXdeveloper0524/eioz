# EIOZ Energy

This site uses Next.js App Router, React, TypeScript, Tailwind CSS, and a Strapi 5 CMS in `cms/`. Routes live in `src/app`; shared site components and data live in `src/components/site` and `src/lib/site.ts`.

## Development

Install dependencies in both directories, then run the two servers in separate terminals:

```sh
npm install
npm --prefix cms install
npm run dev:cms
```

```sh
cp .env.example .env.local
npm run dev
```

The website uses port 3000 by default and Strapi uses port 1337. Open `http://localhost:1337/admin` to create your Strapi administrator. `cms/.env` and its local SQLite database are private and must not be committed.

## Editable content

Strapi starts with the existing 60 projects, eight page hero records, and four jobs. Edit and publish them in Content Manager. The website refreshes published content within about 60 seconds. Page heroes and SEO fields, project listings and featured projects, and careers jobs come from Strapi. Other page sections remain in the Next.js source for now.

The public content endpoints are read-only. Enquiry and application forms post to the Next.js `/api/leads` route, which forwards them to the private Strapi Leads collection. Create a Strapi API token with `create` access to Leads and, if CV uploads are needed, upload access. Set `STRAPI_WRITE_TOKEN` in `.env.local` and in Vercel. Until this token is set, submissions return an error and no message is saved. Keep this token server-side; never prefix it with `NEXT_PUBLIC_`.

## Demo deployment

1. Publish this local Git repository to a new GitHub or GitLab repository. The local `main` branch contains the Next.js app and the Strapi app. The original Lovable-connected repository history was not present in this folder, so the new repository will have a separate history.
2. Deploy `cms/` to Strapi Cloud using `cms` as the base directory. Create the admin account there. The first start seeds the content into Strapi Cloud's database.
3. Import the same repository into Vercel, set the root directory to the repository root, and select the Next.js framework preset.
4. Add `STRAPI_URL` (the public HTTPS URL of your Strapi Cloud app) and `STRAPI_WRITE_TOKEN` in Vercel project environment variables. `STRAPI_READ_TOKEN` is optional while the public content routes are enabled.
5. Redeploy the Vercel project after adding variables. Visit `/projects`, `/careers`, and `/contact-us` on the generated Vercel URL to verify content and forms.

The Strapi server needs persistent hosting and a database; Vercel hosts the Next.js frontend. Local development uses SQLite; Strapi Cloud uses its hosted database.

## Checks

```sh
npm run build
npm --prefix cms run build
npm test
npm run lint
```
