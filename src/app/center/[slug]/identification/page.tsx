import IdentificationForm from "@/components/manager-ui/identification-form";
import Navigation from "@/components/navigation";
import RealTimeProvider from "@/context/real-time-session-provider";
import { checkSession } from "@/lib/supabase/session-management";
import { connectManager } from "@/lib/supabase/utils";
import { headers } from "next/headers";
import Image from "next/image";
import carte from "../../../../../public/carte.jpg";

export default async function Page() {
  await connectManager();
  await checkSession();

  const path = headers().get("referer");
  const center = path?.split("/")[4];

  return (
    <RealTimeProvider>
      <Navigation centerName={center || ""} />
      <div className="min-h-screen lg:max-h-screen lg:overflow-hidden flex flex-col pt-16 px-8">
        <div className="grow flex items-center justify-center flex-col gap-8 lg:flex-row">
          <IdentificationForm centerName={center || ""} />
          <div className="rounded-full overflow-hidden h-48 w-48 lg:fixed lg:right-8 lg:top-20">
            <Image
              src={carte}
              alt="Carte électorale"
              className="scale-[1.80] translate-y-8 translate-x-4"
            />
          </div>
        </div>
      </div>
    </RealTimeProvider>
  );
}
