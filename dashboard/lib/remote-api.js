const DEFAULT_BASE = 'http://localhost:3001';

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_KLARO_API_BASE || DEFAULT_BASE;
}

async function request(path, { method = 'GET', body, headers, ...rest } = {}) {
  const baseUrl = getBaseUrl();
  const url = new URL(path, baseUrl);
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const response = await fetch(url.toString(), {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!response.ok) {
    const error = new Error(`Request to ${url.pathname} failed with status ${response.status}`);
    error.status = response.status;
    error.info = await safeParseJSON(response);
    throw error;
  }

  return safeParseJSON(response);
}

async function safeParseJSON(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn('Failed to parse JSON response', err);
    return null;
  }
}

export async function fetchConfig(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.set(key, value);
    }
  });
  const query = searchParams.toString();
  const payload = await request(`/api/cmp/config${query ? `?${query}` : ''}`);
  if (!payload) {
    throw new Error('Configuration endpoint returned an empty response');
  }

  if (payload.config) {
    return { config: payload.config, meta: payload.meta ?? null };
  }

  return { config: payload, meta: null };
}

export async function updateConfig(config) {
  const payload = await request('/api/cmp/config', {
    method: 'PUT',
    body: { config },
  });
  if (!payload) {
    return { config, meta: null };
  }
  if (payload.config) {
    return { config: payload.config, meta: payload.meta ?? null };
  }
  return { config: payload, meta: null };
}

export async function publishConfig(config) {
  return request('/api/cmp/config/publish', {
    method: 'POST',
    body: { config },
  });
}
