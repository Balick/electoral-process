"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { UserRoundPen } from "lucide-react";
import { useRouter } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Center = {
  id: string;
  nom: string;
  province: string;
  ville: string;
  localite?: string;
  avenue?: string;
  total_electeurs: number;
  total_votes: number;
  manager: any;
};

export const columns: ColumnDef<Center>[] = [
  {
    accessorKey: "nom",
    header: () => <Header header="Nom" />,
    cell: ({ row }) => <Cell value={row.getValue("nom")} />,
  },
  {
    accessorKey: "province",
    header: () => <Header header="Province" />,
    cell: ({ row }) => <Cell value={row.getValue("province")} />,
  },
  {
    accessorKey: "ville",
    header: () => <Header header="Ville" />,
    cell: ({ row }) => <Cell value={row.getValue("ville")} />,
  },
  {
    accessorKey: "localite",
    header: () => <Header header="Localité" />,
    cell: ({ row }) => <Cell value={row.getValue("localite")} />,
  },
  {
    accessorKey: "avenue",
    header: () => <Header header="Avenue" />,
    cell: ({ row }) => <Cell value={row.getValue("avenue")} />,
  },
  {
    accessorKey: "total_electeurs",
    header: () => <Header header="Total Electeurs" />,
    cell: ({ row }) => <Cell value={row.getValue("total_electeurs")} />,
  },
  {
    accessorKey: "total_votes",
    header: () => <Header header="Total Votes" />,
    cell: ({ row }) => <Cell value={row.getValue("total_votes")} />,
  },
  {
    accessorKey: "manager",
    header: () => <Header header="Chef de centre" />,
    cell: function ManagerCell({ row }) {
      const manager = row.original.manager;
      const router = useRouter();

      return (
        <Cell
          value={manager ? manager.name : "-"}
          classNames="flex items-center gap-2"
        >
          <button
            onClick={() =>
              router.push(`/admin/dashboard/centres/manager/${row.original.id}`)
            }
            className="bg-cblue hover:bg-cblue-light text-white hover:text-black transition-all duration-300 font-semibold p-1 text-nowrap w-max rounded-lg"
          >
            <UserRoundPen className="w-4 h-4" />
          </button>
        </Cell>
      );
    },
  },
];

const Header = ({ header }: { header: string }) => (
  <div className="font-semibold text-black">{header}</div>
);

const Cell = ({
  value,
  classNames,
  children,
}: {
  value: string | number;
  children?: React.ReactNode;
  classNames?: string;
}) => {
  const formattedValue = value
    ? typeof value === "string"
      ? `${value[0].toUpperCase()}${value.slice(1)}`
      : value
    : typeof value === "number"
    ? 0
    : "-";

  return (
    <div className={clsx(classNames)}>
      {children}
      {formattedValue}
    </div>
  );
};
