import { getSupabaseClient } from "./client";
import type { User } from "@supabase/supabase-js";

export async function signUp(email: string, password: string, name?: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: "La aplicación no tiene Supabase configurado." };

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: name ? { name } : undefined },
  });
  return { error: error?.message ?? null };
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: "La aplicación no tiene Supabase configurado." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function resetPassword(email: string) {
  const supabase = getSupabaseClient();
  if (!supabase) return { error: "La aplicación no tiene Supabase configurado." };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: typeof window !== "undefined" ? `${window.location.origin}/cuenta` : undefined,
  });
  return { error: error?.message ?? null };
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}
