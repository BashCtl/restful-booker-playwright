# Restful Booker API Tests

API test suite for [Restful Booker](https://restful-booker.herokuapp.com), built with Playwright Test and TypeScript. It covers the health check, authentication, and booking create, read, update, and delete operations. Responses are checked against schemas and booking data is generated with Faker.

## Requirements

- Node.js 20 or later
- npm

## Setup

Install dependencies:

```bash
npm ci
```

The default target is the public Restful Booker API. To use the local environment instead, set `TEST_ENV=local` (the default local URL is `http://localhost:3001`). You can override either environment's URL with `BASE_URL`.

Optional credentials can be set in a `.env` file at the project root:

```dotenv
RB_USERNAME=admin
RB_PASSWORD=password123
```

The defaults shown are for the public demo service. Keep real credentials out of version control; `.env` is ignored by Git.

Environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `TEST_ENV` | `public` | Selects `public` or `local` target |
| `BASE_URL` | URL for selected `TEST_ENV` | Overrides the API base URL |
| `RB_USERNAME` | `admin` | Authentication username |
| `RB_PASSWORD` | `password123` | Authentication password |

## Run

```bash
npm test                 # Run the full suite
npm run test:smoke       # Run tests tagged @smoke
npm run test:ui          # Open Playwright's interactive test UI
npm run typecheck        # Type-check without emitting files
npm run report           # Open the latest HTML report
```

Playwright writes its HTML report to `playwright-report/` and test artifacts to `test-results/`. The configuration retains traces for failed tests. Both output directories are ignored by Git.

## Project layout

```text
src/
  api/                 API endpoints, status codes, and request handler
  config/              Environment selection and configuration
  data/                Booking data factory
  fixtures/            Shared API, auth, and booking fixtures
  helpers/             Authentication token helper
  schemas/             Runtime booking schemas
  types/               TypeScript types
  utils/               Logging and custom assertions
tests/
  auth/                Authentication tests
  booking/             Booking endpoint tests and lifecycle flow
  health/              Ping endpoint test
request-objects/       Booking request template
response-schemas/      JSON response schema fixtures
```

## CI

The GitHub Actions workflow runs on pushes to `master` and pull requests. It installs dependencies, runs the TypeScript check and full test suite, then uploads the Playwright HTML report as an artifact.
