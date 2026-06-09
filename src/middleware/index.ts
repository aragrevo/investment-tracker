import { defineMiddleware } from 'astro:middleware';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(import.meta.env.AUTH_SECRET);

export const onRequest = defineMiddleware(async (context, next) => {
  const cookie = context.request.headers.get('cookie') || '';
  const match = cookie.match(/auth=([^;]+)/);

  if (match) {
    try {
      const { payload } = await jwtVerify(match[1], SECRET);
      context.locals.user = payload.sub;
    } catch {
      context.locals.user = null;
    }
  } else {
    context.locals.user = null;
  }

  const publicPaths = ['/login', '/api/auth'];
  const isPublicPath = publicPaths.some(path => context.url.pathname.startsWith(path));

  if (!context.locals.user && !isPublicPath) {
    return context.redirect('/login');
  }

  if (context.locals.user && context.url.pathname === '/login') {
    return context.redirect('/');
  }

  return next();
});