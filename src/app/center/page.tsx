import { getCenter } from "@/lib/supabase/center";
import { connectManager } from "@/lib/supabase/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const manager = await connectManager();
  const center = await getCenter(manager.center_id);

  redirect(`/center/${center?.nom}`);
}
