"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authSchema } from "@/lib/validation";

export async function signUp(_previousState: { error?: string } | undefined, formData: FormData) {
  const result = authSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: "Use a valid email and a password with at least 8 characters." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email: result.data.email, password: result.data.password, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback` } });
  if (error) return { error: error.message };
  redirect("/onboarding");
}

export async function signIn(_previousState: { error?: string } | undefined, formData: FormData) {
  const result = authSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: "Use a valid email and password." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);
  if (error) return { error: "Those details do not match an account." };
  redirect("/profile");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
