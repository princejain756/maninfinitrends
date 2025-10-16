# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/41b76f9e-90b5-4948-8ef8-3823deedb0e9

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/41b76f9e-90b5-4948-8ef8-3823deedb0e9) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Backend (PostgreSQL + Express + Prisma)

This repo includes an API server for carts, products and orders using PostgreSQL.

Quick start:

1) Start Postgres

```sh
docker compose up -d
```

2) Configure and migrate

```sh
cp server/.env.example server/.env
cd server
npm i
npx prisma generate
npm run prisma:migrate
npm run seed
```

3) Run API server

```sh
npm run dev
# API at http://localhost:3001
```

4) Frontend – create `.env.local` (optional) and run

```sh
cp .env.example .env.local
npm i
npm run dev
# App at http://localhost:5173
```

The frontend reads `VITE_API_BASE_URL` and shows a real cart count in the header.

### Admin User + Product Management

This repo now includes a minimal admin system backed by sessions:

- Seed the admin (username `trendsadmin`, password `trendsa1asf3#4134`):

```sh
cd server
npm run seed:admin
```

- Admin endpoints:
  - `POST /api/auth/login` (body: `{ username, password }`)
  - `GET /api/auth/me` (returns current user if logged in)
  - `POST /api/admin/products` (admin-only; creates product with default variant)

- Frontend admin pages:
  - `http://localhost:5173/admin/login`
  - `http://localhost:5173/admin/products/new`

Product creation payload expects:

```json
{
  "slug": "unique-slug",
  "title": "Product title",
  "description": "Optional description",
  "sku": "SKU-001",
  "priceCents": 129900,
  "images": ["https://..."],
  "categories": ["Sarees"]
}
```

### Razorpay (optional)

- Add your key to `.env` or `.env.local`:

```
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

- If the key is missing, checkout will gracefully run in demo mode.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/41b76f9e-90b5-4948-8ef8-3823deedb0e9) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
