// Supabase client configuration
// This file provides Supabase client for authentication and database

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.includes('supabase.co'));
};

// Simple Supabase client for auth operations
export const supabase = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,
  
  // Sign up a new user
  async signUp(email: string, password: string, metadata?: { full_name?: string; phone?: string; company_name?: string }) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email,
        password,
        data: metadata,
      }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error_description || data.msg || 'Sign up failed');
    }
    return data;
  },
  
  // Sign in an existing user
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error_description || data.msg || 'Sign in failed');
    }
    return data;
  },
  
  // Get all users (admin only - requires service role key which we don't have client-side)
  // This is a stub - in production, you'd call a serverless function
  async getUsers(accessToken: string) {
    if (!isSupabaseConfigured()) {
      return [];
    }
    
    try {
      // This endpoint requires admin privileges
      // In a real app, you'd call a serverless function with the service role key
      const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey': SUPABASE_ANON_KEY,
        },
      });
      
      if (!response.ok) {
        // Fallback to returning empty array if not authorized
        return [];
      }
      
      const data = await response.json();
      return data.users || [];
    } catch {
      return [];
    }
  },
  
  // Sign out
  async signOut(accessToken: string) {
    if (!isSupabaseConfigured()) {
      return;
    }
    
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
  },
};

export default supabase;
