import { redirect } from "next/navigation";
import { connectAdmin } from "@/lib/supabase/utils";

export default async function Page() {
  await connectAdmin();

  redirect("/admin/dashboard");
}
