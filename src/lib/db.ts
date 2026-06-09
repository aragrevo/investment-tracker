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

export interface Investment {
  id: number;
  platform: string;
  year: number;
  value: number;
  deposit?: number;
  growth?: number | null;
}

export async function getInvestments(): Promise<Investment[]> {
  let data = await redis.get<Investment[]>(KEY);
  if (!data) {
    data = SEED_DATA.map((d) => ({
      ...d,
      id: Date.now() + Math.random(),
    }));
    await redis.set(KEY, data);
  }
  return data;
}

export async function saveInvestments(data: Investment[]): Promise<void> {
  await redis.set(KEY, data);
}