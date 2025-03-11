import { getCenters, getManagers } from "@/lib/supabase/center";
import { unstable_noStore } from "next/cache";
import LogOut from "../_components/log-out";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function Page() {
  unstable_noStore();

  const centers = await getCenters();
  const managers = await getManagers();

  const centersWithManagers = centers.map((center) => {
    const managerForCenter = managers?.find((manager) => {
      return manager.center_id === center.id;
    });

    return {
      ...center,
      manager: managerForCenter || null,
    };
  });

  return (
    <div>
      <div className="flex gap-4 justify-between items-center flex-wrap">
        <h1 className="text-xl lg:text-2xl font-semibold uppercase">
          Liste des centres
        </h1>
        <div className="flex gap-2 items-center flex-wrap flex-row-reverse">
          <LogOut />
        </div>
      </div>

      <div className="my-8">
        <DataTable columns={columns} data={centersWithManagers} />
      </div>
    </div>
  );
}
