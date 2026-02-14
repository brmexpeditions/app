import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    if (!keySecret) {
      res.status(400).json({ error: 'Razorpay not configured. Missing RAZORPAY_KEY_SECRET' });
      return;
    }

    const body = (req.body || {}) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
    };

    const orderId = body.razorpay_order_id || '';
    const paymentId = body.razorpay_payment_id || '';
    const signature = body.razorpay_signature || '';

    if (!orderId || !paymentId || !signature) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const payload = `${orderId}|${paymentId}`;
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    const isValid = expected === signature;

    if (!isValid) {
      res.status(400).json({ verified: false, error: 'Invalid signature' });
      return;
    }

    // At this point you should mark the user subscription as active in your DB.
    // That requires a DB table (e.g., subscriptions) and a secure server-side update.

    res.status(200).json({ verified: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Server error' });
  }
}
