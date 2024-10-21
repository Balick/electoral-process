"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();
  const target = formData.get("target") as string;

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error.message);
    //redirect("/error");
    return;
  }

  revalidatePath(`/${target}/signin`, "page");
  redirect(`/${target}`);
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error, data: user } = await supabase.auth.signUp(data);

  if (error) {
    console.error(`❌  [SignUp Error] ${error.message}`);
    return;
  }

  // Verify if user already exists in users table
  const { data: existingUser, error: checkUserError } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.user?.email);

  if (checkUserError) {
    console.error(
      `❌  [Error verifying user existence] ${checkUserError.message}`,
    );
    return;
  }

  // Store user in table if he doesn't exist
  if (existingUser?.length === 0) {
    const { error: insertUserError } = await supabase.from("users").insert({
      email: user.user?.email,
      password: formData.get("password"),
      role: "manager",
    });

    if (insertUserError) {
      console.error(`❌  [Insertion user error] ${insertUserError.message}`);
      return;
    }

    console.log("✅  [Event] Successfully created user. ✨");
    return;
  }

  console.log("[Event Signup] User already exists!");

  revalidatePath("/center/signin", "page");
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(`❌  [SignOut Error] ${error.message}`);
  }
}
