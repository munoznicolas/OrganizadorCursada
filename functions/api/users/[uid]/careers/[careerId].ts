interface Env {
  USER_CAREER_STATES?: {
    get: (key: string, type?: 'text' | 'json') => Promise<any>;
    put: (key: string, value: string, options?: any) => Promise<void>;
    delete: (key: string) => Promise<void>;
  };
}

interface PagesContext {
  request: Request;
  env: Env;
  params: {
    uid: string;
    careerId: string;
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export const onRequestOptions = async (): Promise<Response> => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

export const onRequestGet = async (context: PagesContext): Promise<Response> => {
  const { env, params } = context;
  const { uid, careerId } = params;

  if (!uid || !careerId) {
    return new Response(JSON.stringify({ error: 'Missing uid or careerId parameter' }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  const storageKey = `user:${uid}:career:${careerId}`;

  if (!env.USER_CAREER_STATES) {
    return new Response(JSON.stringify({ error: 'Storage KV not configured' }), {
      status: 503,
      headers: CORS_HEADERS,
    });
  }

  try {
    const rawData = await env.USER_CAREER_STATES.get(storageKey, 'text');
    if (!rawData) {
      return new Response(JSON.stringify({ message: 'No cloud state found' }), {
        status: 404,
        headers: CORS_HEADERS,
      });
    }

    return new Response(rawData, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to retrieve state', details: err?.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};

export const onRequestPut = async (context: PagesContext): Promise<Response> => {
  const { request, env, params } = context;
  const { uid, careerId } = params;

  if (!uid || !careerId) {
    return new Response(JSON.stringify({ error: 'Missing uid or careerId parameter' }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: CORS_HEADERS,
    });
  }

  const payload = {
    ...body,
    updatedAt: new Date().toISOString(),
  };

  const storageKey = `user:${uid}:career:${careerId}`;

  if (!env.USER_CAREER_STATES) {
    return new Response(JSON.stringify({ success: true, mocked: true, updatedAt: payload.updatedAt }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  try {
    await env.USER_CAREER_STATES.put(storageKey, JSON.stringify(payload));
    return new Response(JSON.stringify({ success: true, updatedAt: payload.updatedAt }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Failed to persist state', details: err?.message }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};
