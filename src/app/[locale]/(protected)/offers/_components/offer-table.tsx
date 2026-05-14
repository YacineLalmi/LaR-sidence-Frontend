"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Offer } from "@/schemas/offers/offer.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Image } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PaginatedResponse } from "@/lib/definitions";
import { useLocale, useTranslations } from "next-intl";
import DeleteOfferDialog from "./delete-offer-dialog";
import { ImageFetcher } from "@/components/ui/image-fetcher";
import { StatusBadge } from "@/components/ui/status-badge";
import CustomButton from "@/components/ui/custom-button";
import OfferDocumentDialog from "./offer-document-dialog";
import OfferVisitHistoryDialog from "./offer-visit-history-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { formatId } from "@/lib/utils";
import { deleteOffersAction } from "@/actions/offers/delete-offers.action";

interface Props {
  data: PaginatedResponse<Offer>;
}

export default function OffersTable({ data }: Props) {
  const translation = useTranslations();
  const locale = useLocale() as "fr" | "en" | "ar";

  const columns: ColumnDef<Offer>[] = [
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
      header: translation(TRANSLATIONS_KEYS_2.OFFERS.COLUMNS.ID),
      cell: ({ row }) => formatId(row.original.id),
    },
    {
      id: "bien",
      header: translation(TRANSLATIONS_KEYS_2.OFFERS.COLUMNS.BIEN),
      cell: ({ row }) => {
        if (row.original.bien?.images?.[0]) {
          const firstImageId = row.original.bien.images?.[0]?.id;
          return (
            <div className="flex items-center gap-2">
              {firstImageId ? <ImageFetcher imageId={firstImageId} /> : <Image className="h-8 w-8 text-gray-400" />}
              <div>{row.original.bien.title || "ID: " + formatId(row.original.bien.id)}</div>
            </div>
          );
        } else {
          return row.original?.bien?.title || "ID: " + formatId(row.original?.bien?.id);
        }
      },
    },
    {
      accessorKey: "client",
      header: translation(TRANSLATIONS_KEYS_2.OFFERS.COLUMNS.CLIENT),
      cell: ({ row }) => {
        const client = row.original.client;
        if (!client) return "-";
        const firstName = client.first_name || "";
        const lastName = client.last_name || "";
        return `${firstName} ${lastName}`.trim() || "-";
      },
    },
    {
      accessorKey: "type",
      header: translation(TRANSLATIONS_KEYS_2.OFFERS.COLUMNS.TYPE),
      cell: ({ row }) => {
        const type = row.original.type;
        return type?.name[locale] || "-";
      },
    },
    {
      accessorKey: "proposed_price",
      header: translation(TRANSLATIONS_KEYS_2.OFFERS.COLUMNS.PROPOSED_PRICE),
    },
    {
      accessorKey: "created_at",
      header: translation(TRANSLATIONS_KEYS_2.OFFERS.COLUMNS.CREATED_AT),
      cell: ({ row }) => {
        const date = row.original.created_at;
        if (!date) return "-";
        return new Date(date).toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "status",
      header: translation(TRANSLATIONS_KEYS_2.OFFERS.COLUMNS.STATUS),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "document",
      cell: ({ row }) => <OfferDocumentDialog offer={row.original} />,
      header: "Fiche",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center">
          <DeleteOfferDialog offer={row.original} />
          <Link href={`/offers/${row.original.id}`}>
            <CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0 size-7" />
          </Link>
          <OfferVisitHistoryDialog visits={row.original.visits} />
        </div>
      ),
      header: "Actions",
    },
  ];
  return <DataTable data={data} columns={columns} onDeleteMultiple={deleteOffersAction} />;
}
