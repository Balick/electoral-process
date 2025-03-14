import DateTime from "@/components/date-time";
import NavLinks from "./HeaderNavLink";

export default function Header() {
  return (
    <div className="bg-cblue text-white px-8 py-4 fixed inset-x-0 top-0 z-10">
      <nav className="flex items-center justify-between font-semibold">
        <div className="flex items-center justify-center gap-4">
          <header className="uppercase text-2xl font-bold">CENI RDC</header>
          <NavLinks />
        </div>
        <DateTime />
      </nav>
    </div>
  );
}
