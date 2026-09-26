import { createClient } from "@supabase/supabase-js";
import type { LifeState } from "./life-store";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
}) : null;

export async function loadCloudState(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("life_os_workspaces").select("state").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return (data?.state ?? null) as LifeState | null;
}

export async function saveCloudState(userId: string, state: LifeState) {
  if (!supabase) return;
  const { error } = await supabase.from("life_os_workspaces").upsert({ user_id: userId, state, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
  if (error) throw error;
}
