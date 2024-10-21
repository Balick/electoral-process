import { Metadata } from "next";
import { UserAuthForm } from "@/app/center/components/user-auth-form";
import DateTime from "@/components/date-time";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Portail centre | Connexion",
};

export default async function AuthenticationPage() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    redirect("/center");
  }

  return (
    <>
      <div className="container mx-auto relative flex min-h-screen flex-col items-center justify-center">
        <div className="absolute inset-x-4 top-4 md:inset-x-8 md:top-8 flex items-center justify-between font-semibold uppercase">
          <span>CENI RDC</span>
          <DateTime />
        </div>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-[30rem] px-4 sm:px-8">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Veuillez vous identifier
            </h1>
            <p className="text-lg text-muted-foreground">
              Entrez vos identifiants de connexion
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </>
  );
}
