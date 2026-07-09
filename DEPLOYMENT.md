# Vercel Deployment

This project is configured to deploy the Express/EJS app on Vercel through
`api/index.js` and `vercel.json`.

## Vercel environment variables

Set these in the Vercel project:

- `NODE_ENV=production`
- `APP_NAME=Pioneer`
- `ASSET_ROUTE=/assets`
- `MONGODB_URI=<your MongoDB Atlas connection string>`
- `JWT_SECRET=<long random production secret>`
- `JWT_ISSUER=pioneer-api`
- `JWT_AUDIENCE=pioneer-users`
- `JWT_EXPIRES_IN=1h`
- `ADMIN_EMAILS=<comma separated admin emails>`
- `ALLOW_PUBLIC_REGISTRATION=false`
- `ALLOW_ADMIN_REGISTRATION=false`

Keep both registration flags `false` in production after your first admin user
exists. Only enable them briefly for a controlled admin bootstrap.

## GitHub Actions secrets

Add these repository secrets in GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

You can get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` after linking the project
with `vercel link`; they are stored locally in `.vercel/project.json`.

## Pipeline behavior

- Pull requests to `main` or `master` run checks and create a Vercel preview deploy.
- Pushes to `main` or `master` run checks and deploy to Vercel production.
- Manual runs from the GitHub Actions `workflow_dispatch` button run checks and
  deploy to production.
