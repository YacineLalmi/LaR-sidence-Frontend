// BienTable.tsx
"use client";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Bien } from "@/schemas/biens/bien.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Image } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import CustomButton from "@/components/ui/custom-button";
import { ImageFetcher } from "@/components/ui/image-fetcher";
import { StatusBadge } from "@/components/ui/status-badge";
import DeleteBienDialog from "./delete-bien-dialog";
import { PaginatedResponse } from "@/lib/definitions";
import BienPriceHistoryDialog from "./bien-price-history-dialog";
import { formatId, formatMoney } from "@/lib/utils";
import FicheBienDialog from "./bien-document-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";
import { deleteBiensAction } from "@/actions/Bien/delete-biens.action";

interface Props {
  data: PaginatedResponse<Bien>;
}

export default function BienTable({ data }: Props) {
  const translation = useTranslations();
  const locale = useLocale() as "fr" | "en" | "ar";

  const columns: ColumnDef<Bien>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: translation(TRANSLATIONS_KEYS_2.BIENS.COLUMNS.ID),
      cell: ({ row }) => formatId(row.original.id),
    },
    {
      id: "bien.id",
      cell: ({ row }) => {
        const firstImageId = row.original.images?.[0]?.id;
        return (
          <div className="flex items-center gap-2">
            {firstImageId ? <ImageFetcher imageId={firstImageId} /> : <Image className="h-8 w-8 text-gray-400" />}
          </div>
        );
      },
    },
    {
      id: "bien_type",
      header: translation(TRANSLATIONS_KEYS_2.BIENS.COLUMNS.BIEN_TYPE),
      cell: ({ row }) => {
        return row.original.type?.name[locale];
      },
    },
    {
      accessorKey: "transaction_type",
      header: translation(TRANSLATIONS_KEYS_2.BIENS.COLUMNS.TRANSACTION_TYPE),
      cell: ({ row }) => <span className="font-medium">{row.original.transaction_type?.name[locale]}</span>,
    },
    {
      accessorKey: "price",
      header: translation(TRANSLATIONS_KEYS_2.BIENS.COLUMNS.PRICE),
      cell: ({ row }) => formatMoney(row.original?.price),
    },
    {
      accessorKey: "availability_date",
      header: translation(TRANSLATIONS_KEYS_2.BIENS.COLUMNS.AVAILABILITY_DATE),
      cell: ({ row }) => {
        const date = new Date(row.original.availability_date);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "adresse",
      header: translation(TRANSLATIONS_KEYS_2.BIENS.COLUMNS.ADDRESS),
      cell: ({ row }) => <div className="w-32 leading-5 text-wrap">{row.original.adresse}</div>,
    },
    {
      id: "bien.status",
      header: translation(TRANSLATIONS_KEYS_2.BIENS.COLUMNS.BIEN_STATUS),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "fiche",
      cell: ({ row }) => <FicheBienDialog bien={row.original} />,
      header: translation(TRANSLATIONS_KEYS_2.BIENS.COLUMNS.FICHE),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center">
          <DeleteBienDialog bien={row.original} />
          <Link href={ROUTES.BIENS.EDIT(row.original.id)}>
            <CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0 size-7" />
          </Link>
          <BienPriceHistoryDialog prices={row.original.prices} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS_2.BIENS.COLUMNS.ACTIONS),
    },
  ];

  return <DataTable data={data} columns={columns} onDeleteMultiple={deleteBiensAction} rowClassName="leading-14" />;
}
