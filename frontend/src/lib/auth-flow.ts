import { supabase } from "./supabaseClient";
import apiClient from "@/api/client";

export async function handlePostAuth(user: {
  email: string;
  name?: string;
  sub: string;
}): Promise<{ isVerified: boolean }> {
  const { email, sub: auth0_id } = user;
  const name = user.name ?? email;

  const { data: existingUser } = await supabase
    .from("users")
    .select("id, is_verified")
    .eq("email", email)
    .single();

  if (!existingUser) {
    await supabase.from("users").insert({
      email,
      name,
      auth0_id,
      is_verified: false,
      created_at: new Date().toISOString(),
    });
  }

  // Best-effort backend sync — swallow errors, backend can wire this later.
  // TODO: Move to backend proxy before production to protect API key / secrets.
  try {
    await apiClient.post("/api/auth/sync", { email, auth0_id, name });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[auth-flow] /api/auth/sync failed", error);
    }
  }

  return { isVerified: existingUser?.is_verified ?? false };
}

