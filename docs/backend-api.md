# Remote Configuration API

Klaro can now retrieve consent manager settings from a backend service using
the `RemoteConfigProvider`. The provider expects a REST endpoint that returns
JSON encoded Klaro configuration documents.

## Endpoint

```
GET /api/cmp/config
```

The endpoint may be hosted on the same origin as the Klaro client or on a
separate domain. When the endpoint lives on another origin, ensure that CORS is
configured to allow GET requests from the embedding page.

## Query parameters

| Name | Required | Description |
| ---- | -------- | ----------- |
| `name` | No | Identifier of the configuration to return. When omitted, the provider expects the backend to return the default configuration. |
| `locale` | No | Optional locale hint that enables the backend to localise translations (if supported). |

Additional implementation specific parameters can be added; they will be
forwarded by `RemoteConfigProvider` when `options.params` is supplied.

## Response body

The endpoint must answer with a JSON object. The payload can either contain the
configuration directly or wrap it inside a `config` property. The simplest form
is:

```json
{
  "name": "default",
  "version": 2,
  "services": [
    {
      "name": "google-analytics",
      "title": "Google Analytics",
      "purposes": ["analytics"],
      "required": false
    }
  ],
  "translations": {
    "en": {
      "purposes": {
        "analytics": "Analytics"
      }
    }
  }
}
```

When the configuration is wrapped, the payload should look like:

```json
{
  "config": {
    "name": "default",
    "version": 2,
    "services": [],
    "translations": {}
  },
  "meta": {
    "etag": "abc123",
    "generated_at": "2024-05-21T12:00:00Z"
  }
}
```

Fields that contain executable handlers (`onInit`, `onAccept`, etc.) must be
omitted because remote configurations are purely declarative.

## Error handling

* **404 Not Found** – returned when the requested configuration does not exist.
* **401/403** – indicate that the caller is not authorised; the Klaro client
  will surface the error in the console and fall back to the locally bundled
  configuration if available.
* **5xx** – server side failure. Clients may retry or use cached service
  definitions persisted in `ConsentManager`.

The endpoint should also set appropriate cache headers (`ETag`, `Cache-Control`)
so that browsers can avoid repeated downloads when the configuration is
unchanged.
