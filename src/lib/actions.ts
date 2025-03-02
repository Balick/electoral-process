"use server";

import {redirect} from "next/navigation";

import {createClient} from "@/lib/supabase/server";

type LoginData = {
  email: string;
  password: string;
  target: string;
};

// login function to log in user
export async function login({email, password, target}: LoginData) {
  const supabase = createClient();
  const data = {email, password};
  let errorMessage = "Erreur lors de la connexion.";

  const {error} = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error.message);

    if (error.message === "Invalid login credentials")
      errorMessage = "Vos identifiants sont incorrects.";

    return errorMessage;
  }

  // verify if user is a manager or an admin
  const {data: user} = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // if user is a manager and target is admin, return error message
  if (user.role === "manager" && target === "admin") {
    await signOut();
    errorMessage = "Vos identifiants sont incorrects.";
    return errorMessage;
  }

  // if user is an admin and target is center, return error message
  else if (user.role === "admin" && target === "center") {
    await signOut();
    errorMessage = "Vos identifiants sont incorrects.";
    return errorMessage;
  }

  // else, redirect to target page
  redirect(`/${target}`);
}

// signOut function to log out user
export async function signOut() {
  const supabase = createClient();
  const {error} = await supabase.auth.signOut();

  if (error) {
    console.log(`❌  [SignOut Error] ${error.message}`);
  }
}

export async function ResetData() {
  const supabase = createClient();

  const { error: electeursError } = await supabase
    .from('electeurs')
    .update({
      a_vote: false,
      date_vote: null,
      id_candidat: null
    }).neq('id', "c9b383f0-1819-4e65-bdbc-f991e58f383b");

  if (electeursError) {
    console.error(`❌ [ResetData/electeurs] ${electeursError.message}`);
    throw electeursError;
  }

  const { error: candidatsError } = await supabase
    .from('candidates')
    .update({
      a_vote: false,
      date_vote: null,
      total_votes: 0
    }).neq('id', "c9b383f0-1819-4e65-bdbc-f991e58f383b");

  if (candidatsError) {
    console.error(`❌ [ResetData/candidats] ${candidatsError.message}`);
    throw candidatsError;
  }

  const { error: centresError } = await supabase
    .from('centres')
    .update({
      total_votes: 0
    }).neq('id', "c9b383f0-1819-4e65-bdbc-f991e58c384b");

  if (centresError) {
    console.error(`❌ [ResetData/centres] ${centresError.message}`);
    throw centresError;
  }
}

/*
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
*/