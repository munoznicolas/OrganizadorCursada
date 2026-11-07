---
name: devops-cloudflare
description: Infrastructure configuration, Cloudflare Pages, Pages Functions, KV storage, Docker containerization, and Wrangler deployment for OrganizadorCursada. Trigger when managing environment variables, containers, Cloudflare services, production builds, or CI/CD pipelines. Triggers: devops, docker, docker-compose, cloudflare, pages, workers, kv, wrangler, nginx, build, deploy, environment variables, set-env.
---

# DevOps, Docker & Cloudflare Pages Skill

This skill defines the procedures for containerization, environment variable management, and serverless edge cloud synchronization with **Cloudflare Pages & KV** in **OrganizadorCursada**.

---

## 1. Cloud Architecture & Synchronization

The production infrastructure is 100% serverless at Cloudflare's edge:

```
+--------------------------+
|   Angular Web Client     |
|   - AuthService          |  (Google Identity Services / OAuth 2.0)
|   - CloudSyncService     |  (Edge REST API)
+------------+-------------+
             |
             | HTTPS Requests (Bearer Token / ID)
             v
+--------------------------+
| Cloudflare Pages Edge    |  (Static SPA + Edge CDN)
|  - public/_redirects     |  (/* -> /index.html 200)
+------------+-------------+
             |
             | Co-located Routing
             v
+--------------------------+
| Cloudflare Functions     |  (/functions/api/users/[uid]/careers/[careerId])
+------------+-------------+
             |
             v
+--------------------------+
|   Cloudflare KV Store    |  (USER_CAREER_STATES: user:{uid}:career:{careerId})
+--------------------------+
```

### Key Services

- **`AuthService` (`src/app/services/auth.service.ts`)**: Manages session lifecycles with lightweight Google Identity Services / OAuth 2.0.
- **`CloudSyncService` (`src/app/services/cloud-sync.service.ts`)**: Manages authenticated reads and writes of the user career state document (`UserCareerStateDoc`) via Cloudflare Pages Functions.

---

## 2. Environment Configuration & Pre-Build Script

The project uses a dynamic pre-build script to generate Angular environment files:

```bash
# Defined in package.json:
"config:env": "node scripts/set-env.js"
"build": "npm run config:env && ng build"
```

### Environment Variable Rules

1. `scripts/set-env.js` injects runtime variables into Angular environment configs from system variables or `.env`.
2. **Never** commit production API keys, secrets, or client secrets to version control.
3. When adding new endpoints or Cloudflare bindings, define required keys in `scripts/set-env.js` with safe defaults for local development.

---

## 3. Local Cloudflare Simulation & Deployment

Run local Pages dev server with Functions and simulated KV:
```bash
npm run pages:dev
```

Deploy static SPA and Functions directly with Wrangler:
```bash
npm run pages:deploy
```

---

## 4. Quality Checklist

- [ ] Does `npm run config:env` run without errors?
- [ ] Does `npm run build` create clean bundles in `dist/OrganizadorCursada/browser`?
- [ ] Is `public/_redirects` present for client-side routing fallback?
- [ ] Are unit tests for `CloudSyncService` and `AuthService` passing with 100% success?
