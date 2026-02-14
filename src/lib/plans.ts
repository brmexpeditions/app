export type PlanId = 'starter' | 'professional' | 'enterprise';

export type BillingInfo = {
  plan: PlanId;
  expiresAt?: string; // ISO date
  updatedAt?: string; // ISO date
  lastPaymentId?: string;
  lastOrderId?: string;
};

export function normalizePlan(plan?: string): PlanId {
  const p = (plan || '').toLowerCase().trim();
  if (p === 'enterprise') return 'enterprise';
  if (p === 'professional' || p === 'pro') return 'professional';
  return 'starter';
}

export function isPlanActive(billing?: BillingInfo): boolean {
  if (!billing) return true;
  if (!billing.expiresAt) return true;
  const t = new Date(billing.expiresAt).getTime();
  if (Number.isNaN(t)) return true;
  return Date.now() <= t;
}

export function getPlanLimit(plan: PlanId, limits: { starterVehicles: number; proVehicles: number }): number {
  if (plan === 'enterprise') return Number.POSITIVE_INFINITY;
  if (plan === 'professional') return Math.max(0, limits.proVehicles);
  return Math.max(0, limits.starterVehicles);
}

export function formatPlanName(plan: PlanId): string {
  if (plan === 'professional') return 'Professional';
  if (plan === 'enterprise') return 'Enterprise';
  return 'Starter';
}

export function formatExpiry(expiresAt?: string): string {
  if (!expiresAt) return 'No expiry';
  const d = new Date(expiresAt);
  if (Number.isNaN(d.getTime())) return 'No expiry';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
