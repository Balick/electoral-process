import LogOut from "@/app/admin/dashboard/_components/log-out";
import { getCenter, getManager } from "@/lib/supabase/center";
import { redirect } from "next/navigation";
import EditForm from "./editForm";

export default async function Page({ params }: { params: { id: string } }) {
  const center = await getCenter(params.id);
  const manager = await getManager(params.id);

  if (!center) {
    redirect("/admin");
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
        <h1 className="uppercase mb-8">
          Centre {center?.nom} | {center?.ville}/{center?.province}
        </h1>
        <EditForm manager={manager} centerId={center.id} />
      </div>
    </div>
  );
}
