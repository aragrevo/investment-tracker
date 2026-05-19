import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);
const USER = process.env.AUTH_USER;
const PASS_HASH = process.env.AUTH_PASS_HASH;

function setCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `auth=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400`
  );
}

function parseBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') {
      resolve(req.body);
      return;
    }
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        resolve({});
      }
    });
  });
}

export async function verifyAuth(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/auth=([^;]+)/);
  if (!match) return null;
  try {
    const { payload } = await jwtVerify(match[1], SECRET);
    return payload;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    const user = await verifyAuth(req);
    if (!user) {
      return res.status(401).json({ authenticated: false });
    }
    return res.status(200).json({ authenticated: true, user: user.sub });
  }

  if (req.method === "POST") {
    const { username, password } = await parseBody(req);

    if (!username || !password) {
      return res.status(400).json({ error: "Credenciales requeridas" });
    }

    if (username !== USER) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const valid = await bcrypt.compare(password, PASS_HASH);
    if (!valid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = await new SignJWT({})
      .setSubject(username)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(SECRET);

    setCookie(res, token);
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    res.setHeader(
      "Set-Cookie",
      "auth=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0"
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
