import { connectPresident } from "@/lib/supabase/role-connexion";

export default async function Page() {
  await connectPresident();
  return <div>Président</div>;
}
