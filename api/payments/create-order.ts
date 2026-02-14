import type { VercelRequest, VercelResponse } from '@vercel/node';
import Razorpay from 'razorpay';

type Plan = 'professional' | 'enterprise';

const toInt = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : fallback;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (!keyId || !keySecret) {
      res.status(400).json({ error: 'Razorpay not configured. Missing RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET' });
      return;
    }

    const body = (req.body || {}) as { plan?: string; email?: string; userId?: string };
    const plan = (body.plan || '').toLowerCase() as Plan;

    const planPricesInr: Record<Plan, number> = {
      professional: toInt(process.env.FLEETGUARD_PRO_PRICE, 2000),
      enterprise: toInt(process.env.FLEETGUARD_ENTERPRISE_PRICE, 3500),
    };

    if (!['professional', 'enterprise'].includes(plan)) {
      res.status(400).json({ error: 'Invalid plan. Allowed: professional, enterprise' });
      return;
    }

    const amountInr = planPricesInr[plan];
    if (!amountInr || amountInr <= 0) {
      res.status(400).json({ error: 'Plan amount is not configured correctly.' });
      return;
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: amountInr * 100, // paise
      currency: 'INR',
      receipt: `fleetguard_${plan}_${Date.now()}`,
      notes: {
        plan,
        email: body.email || '',
        userId: body.userId || '',
      },
    });

    res.status(200).json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      plan,
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Server error' });
  }
}
