# Klaro CMP Dashboard

A Next.js management interface for Klaro's remote consent configurations. The dashboard
retrieves configuration documents from the `/api/cmp/config` endpoint (served by your
Klaro backend) and allows operators to inspect, edit, and publish service definitions in
a workflow comparable to platforms such as OneTrust.

## Getting started

```bash
cd dashboard
npm install
npm run dev
```

By default the dashboard expects the Klaro backend to be reachable at
`http://localhost:3001`. Override the target by exporting the
`NEXT_PUBLIC_KLARO_API_BASE` environment variable before starting the development
server.

```bash
NEXT_PUBLIC_KLARO_API_BASE="https://cmp.example.com" npm run dev
```

## Features

- Fetch Klaro configuration documents via the documented `/api/cmp/config` endpoint.
- Inspect configuration metadata (name, version, service count, cache information).
- Create, edit, and remove services with support for key consent attributes and
  purpose definitions.
- Persist updates back to the backend through `PUT /api/cmp/config`.
- Prepare payloads compatible with the `RemoteConfigProvider` and
  `ConsentManager` serialization helpers introduced in Klaro.

## Backend expectations

The dashboard operates against the REST contract outlined in
[`docs/backend-api.md`](../docs/backend-api.md). For editing to work, expose a matching
`PUT /api/cmp/config` endpoint that accepts the updated configuration payload in the
request body:

```json
{
  "config": { /* Klaro configuration */ }
}
```

Implementing `POST /api/cmp/config/publish` is optional but recommended when
configuration drafts need review before being promoted to production. The dashboard
already includes a helper in `lib/remote-api.js` that calls this endpoint if present.
