import { getUsers } from "@/lib/supabase/center";
import LogOut from "../_components/log-out";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

export default async function Page() {
  const users = await getUsers();

  if (!users) {
    return <div>Aucun utilisateur trouvé</div>;
  }

  const usersOrderedList = users.map((user, idx) => {
    return { no: idx + 1, ...user };
  });

  return (
    <div>
      <div className="flex gap-4 justify-between items-center flex-wrap">
        <h1 className="text-xl lg:text-2xl font-semibold uppercase">
          Gestion comptes
        </h1>
        <div className="flex gap-2 items-center flex-wrap flex-row-reverse">
          <LogOut />
        </div>
      </div>

      <div className="my-8">
        <DataTable columns={columns} data={usersOrderedList} />
      </div>
    </div>
  );
}
