# MetaFlux

MetaFlux is an open-source project for **low-code form building**, **data collection**, and **visualization**. It combines a design surface (drawer), shared form logic (core), a runtime renderer, and a web shell built with Umi and Ant Design.

## Repository layout

| Path | Role |
| ------ | ------ |
| `apps/main` | Main web app. Consumes workspace packages. |
| `packages/core` | Shared form engine: formulas, AST utilities, and core types. |
| `packages/drawer` | Designer experience: canvas, drag-and-drop, CodeMirror extensions, and related UI. |
| `packages/renderer` | Runtime renderer for published or embedded forms. |
| `api` | HTTP API (Express) for users and auth: PostgreSQL, migrations, JWT. Intended for [Vercel Functions](https://vercel.com/docs/functions) (`vercel.json` routes `/api/*`). |

## Prerequisites

- **Node.js** (LTS recommended)
- **pnpm** (workspaces are defined at the repo root)
- **PostgreSQL** (only if you run or deploy the `api` service)

## Development

From the repository root:

```bash
pnpm install
pnpm dev
```

`pnpm dev` builds workspace packages once, then runs package watchers and the main app dev server together (`preview` script).

To work on the main app only after packages are built:

```bash
pnpm run build:pkgs
pnpm run dev:main
```

## API and environment

The API loads configuration from environment variables (for example via a `.env` file at the repo root when running locally). Typical variables include:

- `DATABASE_URL` — PostgreSQL connection string
- `PASSWORD_SALT` — secret used when hashing passwords
- `JWT_SECRET` — secret for signing JWTs
- `JWT_EXPIRES_IN_SECONDS` — access token lifetime in seconds

Migrations live under `api/migrations/`. The server applies them on relevant requests.

## License

MIT &copy; Herbert He
