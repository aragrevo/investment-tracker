import type { APIRoute } from 'astro';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const SECRET = new TextEncoder().encode(import.meta.env.AUTH_SECRET);
const USER = import.meta.env.AUTH_USER;
const PASS_HASH = import.meta.env.AUTH_PASS_HASH;

export const GET: APIRoute = async ({ locals, request }) => {
  const origin = request.headers.get('origin') || '*';

  if (!locals.user) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  }

  return new Response(JSON.stringify({ authenticated: true, user: locals.user }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const origin = request.headers.get('origin') || '*';

  let username: string, password: string;
  try {
    const body = await request.json();
    username = body.username;
    password = body.password;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  }

  if (!username || !password) {
    return new Response(JSON.stringify({ error: 'Credenciales requeridas' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  }

  if (username !== USER) {
    return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  }

  const valid = await bcrypt.compare(password, PASS_HASH);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
    });
  }

  const token = await new SignJWT({})
    .setSubject(username)
    .setIssuedAt()
    .setExpirationTime('24h')
    .setProtectedHeader({ alg: 'HS256' })
    .sign(SECRET);

  cookies.set('auth', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    maxAge: 86400,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
  });
};

export const DELETE: APIRoute = async ({ cookies, request }) => {
  const origin = request.headers.get('origin') || '*';

  cookies.delete('auth', { path: '/' });

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
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
};