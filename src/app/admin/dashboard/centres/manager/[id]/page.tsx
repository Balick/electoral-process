import LogOut from "@/app/admin/dashboard/_components/log-out";
import { getCenter, getManager } from "@/lib/supabase/center";
import EditForm from "./editForm";

export default async function Page({ params }: { params: { id: string } }) {
  const center = await getCenter(params.id);
  const manager = await getManager(params.id);
  console.log(center);

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
        <div>{}</div>
        <EditForm manager={manager} />
      </div>
    </div>
  );
}
