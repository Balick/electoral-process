import LogOut from "../_components/log-out";

export default function Page() {
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
    </div>
  );
}
