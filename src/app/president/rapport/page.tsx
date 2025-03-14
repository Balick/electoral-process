import LogOut from "@/app/admin/dashboard/_components/log-out";
import GenerateBtn from "../_components/generateBtn";

export default async function Page() {
  return (
    <div className="relative">
      <div className="flex gap-4 justify-between items-center flex-wrap">
        <h1 className="text-xl lg:text-2xl font-semibold uppercase">
          Rapport des elections
        </h1>
        <div className="flex gap-2 items-center flex-wrap flex-row-reverse">
          <button className="hidden bg-cblue hover:bg-cblue-light text-white hover:text-black transition-all duration-300 font-semibold px-8 text-nowrap w-max py-2 rounded-lg">
            Générer le rapport
          </button>
          <GenerateBtn />
          <LogOut />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4"></div>
    </div>
  );
}
