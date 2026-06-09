import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: import.meta.env.KV_REST_API_URL,
  token: import.meta.env.KV_REST_API_TOKEN,
});

const KEY = 'investments:data';

const SEED_DATA = [
  { platform: 'Quanfury', year: 2023, value: 112 },
  { platform: 'Quanfury', year: 2024, value: 850 },
  { platform: 'Quanfury', year: 2025, value: 2200 },
  { platform: 'Quanfury', year: 2026, value: 3100 },
  { platform: 'Quanfury', year: 2027, value: 2800 },
  { platform: 'Hapi', year: 2024, value: 120 },
  { platform: 'Hapi', year: 2025, value: 450 },
  { platform: 'Hapi', year: 2026, value: 822 },
  { platform: 'Hapi', year: 2027, value: 750 },
  { platform: 'Binance', year: 2024, value: 50 },
  { platform: 'Binance', year: 2025, value: 280 },
  { platform: 'Binance', year: 2026, value: 580 },
  { platform: 'Binance', year: 2027, value: 645 },
  { platform: 'Tyba', year: 2024, value: 100 },
  { platform: 'Tyba', year: 2025, value: 400 },
  { platform: 'Tyba', year: 2026, value: 750 },
  { platform: 'Tyba', year: 2027, value: 831 },
];

export const GET: APIRoute = async ({ locals, request }) => {
  const origin = request.headers.get('origin') || '*';

  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  }

  let data = await redis.get(KEY);
  if (!data) {
    data = SEED_DATA.map((d) => ({
      ...d,
      id: Date.now() + Math.random(),
    }));
    await redis.set(KEY, data);
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
  });
};

export const POST: APIRoute = async ({ locals, request }) => {
  const origin = request.headers.get('origin') || '*';

  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  }

  let body: { data?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  }

  const data = body.data;
  if (!Array.isArray(data)) {
    return new Response(JSON.stringify({ error: 'data must be an array' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  }

  await redis.set(KEY, data);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
  });
};

export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin') || '*';
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
};