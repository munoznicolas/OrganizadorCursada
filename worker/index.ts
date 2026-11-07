interface KVNamespaceLike {
  get(key: string, type: 'text'): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  USER_CAREER_STATES?: KVNamespaceLike;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const API_ROUTE = /^\/api\/users\/([^/]+)\/careers\/([^/]+)\/?$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

async function handleCareerState(
  request: Request,
  env: Env,
  uid: string,
  careerId: string,
): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: JSON_HEADERS });
  }
  if (!env.USER_CAREER_STATES) {
    return json({ error: 'Storage KV not configured' }, 503);
  }
  const key = `user:${uid}:career:${careerId}`;

  if (request.method === 'GET') {
    const raw = await env.USER_CAREER_STATES.get(key, 'text');
    return raw ? new Response(raw, { status: 200, headers: JSON_HEADERS }) : json({ message: 'No cloud state found' }, 404);
  }

  if (request.method === 'PUT') {
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return json({ error: 'Invalid JSON payload' }, 400);
    }
    const updatedAt = new Date().toISOString();
    await env.USER_CAREER_STATES.put(key, JSON.stringify({ ...body, updatedAt }));
    return json({ success: true, updatedAt });
  }

  return json({ error: 'Method not allowed' }, 405);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const match = API_ROUTE.exec(url.pathname);
    if (match) {
      try {
        return await handleCareerState(request, env, decodeURIComponent(match[1]), decodeURIComponent(match[2]));
      } catch (err) {
        return json({ error: 'Internal error', details: (err as Error)?.message }, 500);
      }
    }
    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'Not found' }, 404);
    }
    return env.ASSETS.fetch(request);
  },
};
