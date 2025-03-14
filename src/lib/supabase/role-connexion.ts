"use server";

import { signOut } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// connectManager function to connect the user to the manager role
export async function connectManager() {
  const supabase = createClient();
  const { data: UserAuth, error } = await supabase.auth.getUser();

  if (error || !UserAuth?.user) {
    redirect("/auth/signin");
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", UserAuth.user.email)
    .single();

  // if the user is not a manager, log out and redirect to the signin page
  if (user.role !== "manager") {
    await signOut().then(() => redirect("/auth/signin"));
  }

  return user;
}

// connectAdmin function to connect the user to the admin role
export async function connectAdmin() {
  const supabase = createClient();
  const { data: UserAuth, error } = await supabase.auth.getUser();

  if (error || !UserAuth?.user) {
    redirect("/auth/signin");
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", UserAuth.user.email)
    .single();

  // if the user is not an admin, log out and redirect to the signin page
  if (user.role !== "admin") {
    await signOut().then(() => redirect("/auth/signin"));
  }

  return user;
}

export async function connectPresident() {
  const supabase = createClient();
  const { data: UserAuth, error } = await supabase.auth.getUser();

  if (error || !UserAuth?.user) {
    redirect("/auth/signin");
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", UserAuth.user.email)
    .single();

  // if the user is not an admin, log out and redirect to the signin page
  if (user.role !== "president") {
    await signOut().then(() => redirect("/auth/signin"));
  }

  return user;
}
