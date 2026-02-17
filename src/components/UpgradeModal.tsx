import { useMemo, useState } from 'react';
import type { BillingInfo, PlanId } from '@/lib/plans';
import { formatExpiry, formatPlanName } from '@/lib/plans';

type Props = {
  open: boolean;
  onClose: () => void;
  reason?: string;

  billing: BillingInfo;
  vehicleCount: number;

  starterVehicles: number;
  proVehicles: number;
  proPrice: number;
  enterprisePrice: number;

  currentUserId?: string;
  currentUserEmail?: string;

  onBillingUpdated: (next: BillingInfo) => void;
};

async function loadRazorpayScript(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) return resolve();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load Razorpay checkout script'));
    document.body.appendChild(s);
  });
}

function addOneYearIso(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString();
}

export function UpgradeModal(props: Props) {
  const {
    open,
    onClose,
    reason,
    billing,
    vehicleCount,
    starterVehicles,
    proVehicles,
    proPrice,
    enterprisePrice,
    currentUserEmail,
    currentUserId,
    onBillingUpdated,
  } = props;

  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [status, setStatus] = useState<string>('');

  const planCards = useMemo(
    () => [
      {
        id: 'starter' as const,
        title: 'Starter',
        priceLabel: 'FREE',
        sub: `Up to ${starterVehicles} vehicles`,
        features: ['Basic reminders', 'Document tracking', 'Service intervals'],
        cta: 'Current / Free',
        disabled: true,
      },
      {
        id: 'professional' as const,
        title: 'Professional',
        priceLabel: `₹${proPrice.toLocaleString()}/year`,
        sub: `Up to ${proVehicles} vehicles`,
        features: ['Excel import/export', 'Analytics', 'Priority support'],
        cta: 'Upgrade to Professional',
        disabled: false,
      },
      {
        id: 'enterprise' as const,
        title: 'Enterprise',
        priceLabel: `₹${enterprisePrice.toLocaleString()}/year`,
        sub: 'Unlimited vehicles',
        features: ['Unlimited vehicles', 'All features', 'Dedicated support'],
        cta: 'Upgrade to Enterprise',
        disabled: false,
      },
    ],
    [enterprisePrice, proPrice, proVehicles, starterVehicles]
  );

  if (!open) return null;

  const handleUpgrade = async (plan: PlanId) => {
    if (plan === 'starter') return;

    setStatus('');
    setLoadingPlan(plan);

    try {
      // 1) Create order on server
      const resp = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan === 'professional' ? 'professional' : 'enterprise',
          email: currentUserEmail || '',
          userId: currentUserId || '',
        }),
      });

      const payload = await resp.json();
      if (!resp.ok) throw new Error(payload?.error || 'Failed to create Razorpay order');

      await loadRazorpayScript();

      // 2) Open checkout
      const options: any = {
        key: payload.keyId,
        amount: payload.amount,
        currency: payload.currency,
        order_id: payload.orderId,
        name: 'Fleet Guard 360',
        description: `Fleet Guard 360 yearly subscription – ${formatPlanName(plan)}`,
        prefill: {
          email: currentUserEmail || undefined,
        },
        theme: {
          color: '#f59e0b',
        },
        handler: async (rzpResp: any) => {
          try {
            setStatus('Verifying payment…');

            // 3) Verify signature
            const vr = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(rzpResp),
            });
            const vj = await vr.json();
            if (!vr.ok || !vj.verified) {
              throw new Error(vj?.error || 'Verification failed');
            }

            // 4) Activate subscription (server-side best effort)
            // If server endpoint is not configured (missing service-role key), we still apply locally.
            try {
              await fetch('/api/subscriptions/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  plan,
                  userId: currentUserId || '',
                  razorpay_order_id: rzpResp.razorpay_order_id,
                  razorpay_payment_id: rzpResp.razorpay_payment_id,
                  razorpay_signature: rzpResp.razorpay_signature,
                }),
              });
            } catch {
              // ignore
            }

            const next: BillingInfo = {
              plan,
              expiresAt: addOneYearIso(),
              updatedAt: new Date().toISOString(),
              lastOrderId: rzpResp.razorpay_order_id,
              lastPaymentId: rzpResp.razorpay_payment_id,
            };

            onBillingUpdated(next);
            setStatus('✅ Subscription activated!');
            setTimeout(() => onClose(), 800);
          } catch (e: any) {
            setStatus(`❌ ${e?.message || 'Payment verification failed'}`);
          }
        },
      };

      // @ts-ignore
      const rz = new (window as any).Razorpay(options);
      rz.on('payment.failed', (resp: any) => {
        setStatus(`❌ Payment failed: ${resp?.error?.description || 'Unknown error'}`);
      });
      rz.open();
    } catch (e: any) {
      setStatus(`❌ ${e?.message || 'Upgrade failed'}`);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-amber-500/20 bg-gray-900 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Upgrade your plan</h3>
            <p className="text-sm text-gray-400 mt-1">
              Current plan: <span className="text-amber-400 font-semibold">{formatPlanName(billing.plan)}</span>
              {billing.expiresAt ? (
                <>
                  {' '}• Expires: <span className="text-gray-200">{formatExpiry(billing.expiresAt)}</span>
                </>
              ) : null}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {reason && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-xl p-4 text-sm">
              {reason}
            </div>
          )}

          <div className="text-sm text-gray-300">
            You have <span className="font-semibold text-white">{vehicleCount}</span> vehicle(s) in your fleet.
          </div>

          {status && (
            <div className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-gray-200">
              {status}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            {planCards.map((p) => (
              <div key={p.id} className="rounded-2xl border border-gray-800 bg-gray-950 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{p.title}</h4>
                  {p.id === 'professional' && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-500 text-black">Popular</span>
                  )}
                </div>
                <div className="mt-4 text-2xl font-black text-white">{p.priceLabel}</div>
                <div className="mt-1 text-sm text-gray-400">{p.sub}</div>

                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={p.disabled || loadingPlan !== null}
                  onClick={() => handleUpgrade(p.id)}
                  className={
                    p.id === 'professional'
                      ? 'mt-5 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold disabled:opacity-50'
                      : p.id === 'enterprise'
                        ? 'mt-5 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold disabled:opacity-50'
                        : 'mt-5 w-full px-4 py-2.5 rounded-xl bg-gray-800 text-gray-400 font-semibold cursor-not-allowed'
                  }
                >
                  {loadingPlan === p.id ? 'Working…' : p.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500">
            Yearly subscription. Vehicle limits are enforced in the app. Payments via Razorpay support UPI, cards, and netbanking.
          </div>
        </div>
      </div>
    </div>
  );
}
