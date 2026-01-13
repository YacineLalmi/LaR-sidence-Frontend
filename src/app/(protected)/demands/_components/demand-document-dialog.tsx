"use client";

import React, { useState } from "react";
import { FileSearch, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomButton from "@/components/ui/custom-button";
import { Demand } from "@/schemas/demands/demand.schema";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { useTranslations } from "next-intl";

interface Props {
  demand: Demand;
}

export default function DemandDocumentDialog({ demand }: Props) {
  const translation = useTranslations();
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      Ouvert: "bg-blue-100 text-blue-700",
      "En cours": "bg-yellow-100 text-yellow-700",
      Fermé: "bg-green-100 text-green-700",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton Icon={FileSearch} size="icon" variant="ghost" className="!p-0" />
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 gap-0" showCloseButton={false}>
        <DialogHeader className="p-6 pb-4 relative flex justify-between flex-row items-start">
          <DialogTitle className="text-2xl font-light text-amber-600">Fiche demande</DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full bg-black text-white p-1.5 hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-4">
              {/* ID */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">ID de la demande</label>
                <div className="font-semibold text-base">#{demand.id}</div>
              </div>

              {/* Type */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Type de la Demande</label>
                <div className="font-medium text-sm">{demand.type.name}</div>
              </div>

              {/* Client Name */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Client Concerné</label>
                <div className="font-semibold text-base">
                  {demand.client.first_name + " " + demand.client.last_name}
                </div>
              </div>

              {/* Bien Title */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Bien Concerné</label>
                <div className="font-medium text-sm">{demand.bien.title}</div>
              </div>

              {/* Status */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Statut de la demand</label>
                <div className="font-medium text-sm">
                  <StatusBadge status={demand.status} />
                </div>
              </div>

              {/* Budget */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Budget</label>
                <div className="font-semibold text-base">{demand.budget}</div>
              </div>

              {/* Priority */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Priorité</label>
                <div className="font-medium text-base">{demand.priority.name}</div>
              </div>

              {/* Agent */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Agent Attribué</label>
                <div className="font-medium text-base">{demand.agent.first_name + " " + demand.agent.last_name}</div>
              </div>
            </div>
            <div>
              {/* Source */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Source de la demand</label>
                <div className="font-semibold text-base">{demand.source.name}</div>
              </div>

              {/* Description */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Commentaires internes</label>
                <div className="text-sm leading-relaxed text-gray-800">{demand.comment}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 px-6 pb-6 pt-4 border-t justify-center">
          <Link href={NAVIGATION_KEYS.DEMANDS.EDIT(demand.id)}>
            <CustomButton text={translation(TRANSLATIONS_KEYS.COMMON.EDIT)} variant="ghost" className="w-42" />
          </Link>
          <CustomButton text={translation(TRANSLATIONS_KEYS.COMMON.PRINT)} className="w-42" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
