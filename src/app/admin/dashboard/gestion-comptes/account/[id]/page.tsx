import LogOut from "@/app/admin/dashboard/_components/log-out";
import { getUser } from "@/lib/supabase/center";
import { redirect } from "next/navigation";
import EditForm from "./editForm";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  if (!user) {
    redirect("/admin/dashboard/gestion-comptes");
  }

  return (
    <div>
      <div className="flex gap-4 justify-between items-center flex-wrap">
        <h1 className="text-xl lg:text-2xl font-semibold uppercase">
          Informations Compte
        </h1>
        <div className="flex gap-2 items-center flex-wrap flex-row-reverse">
          <LogOut />
        </div>
      </div>

      <div className="my-8">
        <EditForm data={user} />
      </div>
    </div>
  );
}
