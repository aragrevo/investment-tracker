import { Redis } from "@upstash/redis";
import { verifyAuth } from "./auth.js";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const KEY = "investments:data";

const SEED_DATA = [
  { platform: "Quanfury", year: 2023, value: 112 },
  { platform: "Quanfury", year: 2024, value: 850 },
  { platform: "Quanfury", year: 2025, value: 2200 },
  { platform: "Quanfury", year: 2026, value: 3100 },
  { platform: "Quanfury", year: 2027, value: 2800 },
  { platform: "Hapi", year: 2024, value: 120 },
  { platform: "Hapi", year: 2025, value: 450 },
  { platform: "Hapi", year: 2026, value: 822 },
  { platform: "Hapi", year: 2027, value: 750 },
  { platform: "Binance", year: 2024, value: 50 },
  { platform: "Binance", year: 2025, value: 280 },
  { platform: "Binance", year: 2026, value: 580 },
  { platform: "Binance", year: 2027, value: 645 },
  { platform: "Tyba", year: 2024, value: 100 },
  { platform: "Tyba", year: 2025, value: 400 },
  { platform: "Tyba", year: 2026, value: 750 },
  { platform: "Tyba", year: 2027, value: 831 },
];

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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const user = await verifyAuth(req);
  if (!user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  if (req.method === "GET") {
    let data = await redis.get(KEY);
    if (!data) {
      data = SEED_DATA.map((d) => ({
        ...d,
        id: Date.now() + Math.random(),
      }));
      await redis.set(KEY, data);
    }
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { data } = await parseBody(req);
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "data must be an array" });
    }
    await redis.set(KEY, data);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
