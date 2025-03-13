"use client";

import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Center = {
  no: number;
  id: string;
  name: string;
  email: string;
  password: string;
  role: "manager" | "admin" | "chief";
  center_id?: string;
};

export const columns: ColumnDef<Center>[] = [
  {
    accessorKey: "no",
    header: () => <Header header="N°" />,
    cell: ({ row }) => <Cell value={row.getValue("no")} />,
  },
  {
    accessorKey: "name",
    header: () => <Header header="Nom complet" />,
    cell: ({ row }) => <Cell value={row.getValue("name")} />,
  },
  {
    accessorKey: "email",
    header: () => <Header header="Email" />,
    cell: ({ row }) => <Cell value={row.getValue("email")} />,
  },
  {
    accessorKey: "role",
    header: () => <Header header="Rôle" />,
    cell: ({ row }) => <Cell value={row.getValue("role")} />,
  },
  {
    accessorKey: "action",
    header: () => <Header header="Action" />,
    cell: ({ row }) => {
      return (
        <Cell classNames="flex items-center gap-2">
          <Link
            href={`/admin/dashboard/gestion-comptes/account/${row.original.id}`}
            type="button"
            className="bg-cblue hover:bg-cblue-light text-white hover:text-black transition-all duration-300 py-1 px-2 text-nowrap w-max rounded-lg"
          >
            Modifier
          </Link>
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
  value?: string | number;
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
      {value && formattedValue}
    </div>
  );
};
