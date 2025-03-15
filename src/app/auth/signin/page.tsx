import DateTime from "@/components/date-time";
import { signOut } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import ceniLogo from "../../../../public/ceni-logo.png";
import { UserAuthForm } from "./userAuthForm";

export const metadata: Metadata = {
  title: "CENI | Authentification",
};

export default async function AuthenticationPage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (
    error &&
    error.message !== "Auth session missing!" &&
    error.message !== "Invalid Refresh Token: Refresh Token Not Found"
  ) {
    return <ErrorPage />;
  }

  // if user is authenticated, redirect to the corresponding page
  if (data.user) {
    const { id } = data.user;
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    const role = user.role;

    if (role === "admin") redirect(`/admin`);
    else if (role === "president") redirect(`/president`);

    const { data: center, error: centerError } = await supabase
      .from("centres")
      .select("nom")
      .eq("id", user.center_id)
      .single();

    if (centerError) await signOut();

    redirect(`/center/${center?.nom}`);
  }

  return (
    <div className="container mx-auto relative flex min-h-screen flex-col items-center justify-center">
      <PageHeader />
      <Image
        src={ceniLogo}
        alt="Logo de la CENI"
        className="w-[45rem] h-[30rem] mb-8 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5"
      />

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[30rem] px-4 sm:px-8 relative z-20">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Veuillez vous identifier
          </h1>
          <p className="text-lg text-muted-foreground">
            Entrez vos identifiants de connexion
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  );
}

function ErrorPage() {
  return (
    <div className="z-20 container mx-auto relative flex min-h-screen flex-col items-center justify-center">
      <PageHeader />

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[30rem] px-4 sm:px-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Erreur serveur
          </h1>
          <p className="text-lg text-muted-foreground">
            Une erreur s&apos;est produite lors de la connexion. Veuillez
            réessayer plus tard.
          </p>
        </div>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="absolute inset-x-4 top-4 md:inset-x-8 md:top-8 flex items-center justify-between font-semibold uppercase">
      <span>CENI RDC | Connexion</span>
      <DateTime />
    </div>
  );
}
