# Next.js Multi-Domain Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

It is configured to serve **different parts of the site based on the domain or subdomain**, using **Next.js App Router**, **route groups**, and **domain-based routing**.

---

## 🌐 Project Domains

| Domain                    | Purpose         | Served From                     |
|---------------------------|------------------|----------------------------------|
| `www.websitedomain.com`   | Website Page     | `app/(website)/page.tsx`         |
| `app.websitedomain.com`   | Main Application | `app/(app)/dashboard/page.tsx`   |

Both are served from a single Next.js project using folder-based routing and conditional rewrites.

---

## 📁 Folder Structure

```txt
app/
├── (website)/         # Public website (www)
│   └── page.tsx
├── (app)/             # Main application
│   └── page.tsx
├── middleware.ts      # Local domain-based route rewrites
vercel.json            # Live domain-based routing rules

components/
└── ui/                # Reusable UI components

data/
├── domain/            # Domain logic and fake repositories for testing
│   ├── di/            # Dependency injection setup
│   └── fake/          # Fake implementations (e.g., AuthRepoImpl, userDb)
├── repo/              # Repository interfaces (e.g., AuthRepository)
└── utils/             # Utilities (exceptions, network requests, etc.)
```

---

## 🚀 Getting Started

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

This starts the app at [http://localhost:3000](http://localhost:3000)

---

## 🧪 Local Development Tutorial (Simulate Subdomains)

This tutorial will help you test domain-based routing **locally** using `middleware.ts`.

### ✅ Step 1: Simulate Local Domains

Edit your `/etc/hosts` file (Linux/macOS) or `C:\Windows\System32\drivers\etc\hosts` (Windows) and add:

```txt
127.0.0.1   localhost
127.0.0.1   app.localhost
```

> This allows you to access your site using fake subdomains like `localhost`.

---

### ✅ Step 2: Create Middleware

In `app/middleware.ts`, add:

```ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  if (host.startsWith('localhost')) {
    return NextResponse.rewrite(new URL('/(website)', request.url))
  }

  if (host.startsWith('app.localhost')) {
    return NextResponse.rewrite(new URL('/(app)/dashboard', request.url))
  }

  return NextResponse.next()
}
```

This file ensures the correct page is served depending on the simulated domain.

---

### ✅ Step 3: Start the Dev Server

Run the server on all interfaces:

```bash
npx next dev -H 0.0.0.0 -p 3000
```

Now access:

- `http://localhost:3000` → Loads the website page
- `http://app.localhost.test:3000` → Loads the main app

> Tip: If the domains don't resolve, restart your browser or flush DNS cache.

---

## ☁️ Live Deployment Tutorial (Vercel)

This tutorial shows how to deploy to [Vercel](https://vercel.com) with multiple domains and routing logic.

### ✅ Step 1: Add Your Domains to Vercel

1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Settings → Domains**
3. Add:
   - `www.websitedomain.com`
   - `app.websitedomain.com`
4. Update your DNS provider to point to `cname.vercel-dns.com`

---

### ✅ Step 2: Add a `vercel.json` File

In your project root, create `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/",
      "has": [
        {
          "type": "host",
          "value": "www.websitedomain.com"
        }
      ]
    },
    {
      "source": "/",
      "destination": "/dashboard",
      "has": [
        {
          "type": "host",
          "value": "app.websitedomain.com"
        }
      ]
    }
  ]
}
```

This tells Vercel to rewrite requests based on the domain to their respective route groups.

---

### ✅ Step 3: Deploy

Deploy your project as usual:

```bash
git push origin main
# or
vercel --prod
```

Once deployed, Vercel will handle domain-based routing using `vercel.json`.

---

## 🗂️ Project Structure Documentation

The project is organized to support multi-domain routing and modular feature development. Here’s an overview of the main folders and their purposes:

```
app/
├── (website)/         # Public website (www)
│   └── page.tsx
├── (app)/             # Main application
│   └── page.tsx
├── middleware.ts      # Local domain-based route rewrites
vercel.json            # Live domain-based routing rules

components/
└── ui/                # Reusable UI components

data/
├── domain/            # Domain logic and fake repositories for testing
│   ├── di/            # Dependency injection setup
│   └── fake/          # Fake implementations (e.g., AuthRepoImpl, userDb)
├── repo/              # Repository interfaces (e.g., AuthRepository)
└── utils/             # Utilities (exceptions, network requests, etc.)
```

- **app/**: Contains route groups for different domains and middleware for local routing.
- **components/**: Shared UI components.
- **data/domain/**: Domain logic, dependency injection, and fake data sources for local/testing.
- **data/repo/**: Repository interfaces for data access.
- **data/utils/**: Utility modules (error handling, network requests, etc.).

Refer to this structure when adding new features or debugging existing ones.

---

## 🧠 Tips

- `middleware.ts` is used **only for local development**
- `vercel.json` is used **only in production on Vercel**
- You can extend this setup to more domains and route groups

---

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Vercel Domain Routing](https://vercel.com/docs/concepts/projects/custom-domains)
- [Vercel Rewrites](https://vercel.com/docs/edge-network/rewrites)

---

## 📜 License

This project is open source under the [MIT License](https://opensource.org/licenses/MIT).