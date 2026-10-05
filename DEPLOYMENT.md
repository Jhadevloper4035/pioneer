# Vercel Deployment

This project is configured to deploy the Express/EJS app on Vercel through
`api/index.js` and `vercel.json`.

## Vercel environment variables

Set these in the Vercel project:

- `NODE_ENV=production`
- `APP_NAME=Pioneer`
- `ASSET_ROUTE=/assets`
- `SITE_URL=https://your-domain.com`
- `MONGODB_URI=<your MongoDB Atlas connection string>`
- `JWT_SECRET=<at least 32 random characters>`
- `JWT_ISSUER=pioneer-api`
- `JWT_AUDIENCE=pioneer-users`
- `JWT_EXPIRES_IN=1h`
- `ALLOW_PUBLIC_REGISTRATION=false`
- `RECAPTCHA_SITE_KEY=<Google reCAPTCHA v3 site key>`
- `RECAPTCHA_SECRET_KEY=<Google reCAPTCHA v3 secret key>`
- `RECAPTCHA_MIN_SCORE=0.5`
- `SMTP_HOST=smtpout.secureserver.net`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=admin@your-domain.com`
- `SMTP_PASS=<GoDaddy mailbox password>`
- `SMTP_FROM="Pioneer Decor <admin@your-domain.com>"`

Use the GoDaddy Professional Email mailbox password, not your GoDaddy account
password. Configure these variables for both Preview and Production so the
preview deployment can start successfully.

Register both the production domain and Vercel preview domain in the Google
reCAPTCHA v3 console. Keep the secret key in Vercel only; never expose it in
browser code or commit it to the repository.

Keep public registration `false` in production unless users should be able to
create accounts. Public registration never grants admin access.

## GitHub Actions secrets

Add these repository secrets in GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

You can get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` after linking the project
with `vercel link`; they are stored locally in `.vercel/project.json`.
Create or replace an expired `VERCEL_TOKEN` with `vercel login` and
`vercel tokens add`, then update the GitHub repository secret.

## Pipeline behavior

- Pull requests to `main` or `master` run checks and create a Vercel preview deploy.
- Pushes to `main` or `master` run checks and deploy to Vercel production.
- Manual runs from the GitHub Actions `workflow_dispatch` button run checks and
  deploy to production.

## Release check

After deployment, open `https://your-domain.com/health`. A successful response
is JSON with `"status":"ok"`. Submit one contact enquiry and one job
application to confirm MongoDB persistence and GoDaddy SMTP delivery.
