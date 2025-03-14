import { connectPresident } from "@/lib/supabase/role-connexion";
import Header from "./_components/Header";

export default async function PresidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connectPresident();
  return (
    <main className="relative min-h-screen w-full p-8 pt-20">
      <Header />
      <div className="min-h-[84vh]">{children}</div>
    </main>
  );
}
