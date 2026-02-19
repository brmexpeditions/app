import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Requires SERVICE ROLE key for admin access
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, plan, adminEmail } = req.body;

    if (!userId || !plan || !adminEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
        const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
        const adminEmails = (process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || '')
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .filter(Boolean);

        if (!adminEmails.includes(adminEmail.toLowerCase())) {
            return res.status(403).json({ error: 'Forbidden: Requester is not an admin' });
        }

        if (!supabaseUrl || !serviceKey) {
            return res.status(500).json({ error: 'Supabase admin not configured' });
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
            auth: { persistSession: false, autoRefreshToken: false },
        });

        // 1. Update Profile table
        const { error: profError } = await supabaseAdmin
            .from('user_profiles')
            .update({ plan })
            .eq('user_id', userId);

        if (profError) throw profError;

        // 2. Update Auth Metadata
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { user_metadata: { plan } }
        );

        if (authError) throw authError;

        return res.status(200).json({ success: true, message: `User plan updated to ${plan}` });
    } catch (error: any) {
        console.error('Update user error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
