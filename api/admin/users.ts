import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// This endpoint requires the SERVICE ROLE key (server-side only).
// Add these env vars in Vercel:
// - VITE_SUPABASE_URL (or SUPABASE_URL)
// - SUPABASE_SERVICE_ROLE_KEY
// - ADMIN_EMAILS (comma-separated)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
    const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

    if (!supabaseUrl || !serviceKey) {
      res.status(200).json({ users: [], warning: 'Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' });
      return;
    }

    // Basic admin guard: require an admin email passed in header.
    // In production you should verify a Supabase JWT here.
    const adminEmails = (process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const requesterEmail = String(req.headers['x-admin-email'] || '').toLowerCase().trim();
    if (adminEmails.length > 0 && (!requesterEmail || !adminEmails.includes(requesterEmail))) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Prefer user_profiles table for friendly fields.
    const { data: profiles, error: profErr } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id,email,name,phone,company_name,created_at')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (!profErr && profiles) {
      res.status(200).json({
        users: profiles.map((p: any) => ({
          id: p.user_id,
          email: p.email,
          name: p.name,
          phone: p.phone,
          companyName: p.company_name,
          createdAt: p.created_at,
        })),
        source: 'user_profiles',
      });
      return;
    }

    // Fallback to Supabase Auth listUsers
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000, page: 1 });
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({
      users: (data.users || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.user_metadata?.name || u.email,
        phone: u.user_metadata?.phone || '',
        companyName: u.user_metadata?.companyName || '',
        createdAt: u.created_at,
      })),
      source: 'auth',
    });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Server error' });
  }
}
