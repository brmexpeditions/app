import { assertSupabase, isSupabaseConfigured } from './supabase';

export type UserProfile = {
  user_id: string;
  email: string;
  name: string;
  phone?: string;
  company_name?: string;
  created_at?: string;
};

const TABLE = 'user_profiles';

export async function upsertMyProfile(profile: {
  user_id: string;
  email: string;
  name: string;
  phone?: string;
  company_name?: string;
}) {
  if (!isSupabaseConfigured) return;
  const supabase = assertSupabase();

  // Best-effort: if table doesn't exist or RLS blocks, ignore.
  const { error } = await supabase.from(TABLE).upsert(
    {
      user_id: profile.user_id,
      email: profile.email,
      name: profile.name,
      phone: profile.phone || null,
      company_name: profile.company_name || null,
    },
    { onConflict: 'user_id' }
  );

  if (error) throw error;
}

export async function listUserProfiles(limit = 500): Promise<UserProfile[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = assertSupabase();

  const { data, error } = await supabase
    .from(TABLE)
    .select('user_id,email,name,phone,company_name,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as UserProfile[]) || [];
}
