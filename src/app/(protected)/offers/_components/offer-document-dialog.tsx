"use client";
import React, { useState } from "react";
import { FileSearch, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Offer } from "@/schemas/offers/offer.schema";
import CustomButton from "@/components/ui/custom-button";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

interface Props {
  offer: Offer;
}
export default function OfferDocumentDialog({ offer }: Props) {
  const [open, setOpen] = useState(false);
  const translation = useTranslations();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton Icon={FileSearch} size="icon" variant="ghost" className="!p-0" />
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 gap-0" showCloseButton={false}>
        <DialogHeader className="p-6 pb-0 relative flex justify-between flex-row">
          <DialogTitle className="text-2xl font-light text-amber-600">Fiche Offer</DialogTitle>
          <CustomButton Icon={X} size="icon" className="!p-0" onClick={() => setOpen(false)} />
        </DialogHeader>

        {/* Content */}
        <div className="px-8 py-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* ID de l'Offre & Date de Création */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-gray-500 block mb-1">ID de l'Offre</label>
              <div className="font-bold text-lg">{offer.id}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Date de Création</label>
              <div className="font-semibold">{format(offer.created_at, "dd-mm-yyyy HH:MM")}</div>
            </div>
          </div>

          {/* Bien Associé & Date de Dernière Modification */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Bien Associé</label>
              <div className="font-semibold">{offer.bien.title}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Date de Dernière Modification</label>
              <div className="font-semibold">{offer.updated_at && format(offer.updated_at, "dd-mm-yyyy HH:MM")}</div>
            </div>
          </div>

          {/* Client */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Client</label>
            <div className="font-semibold">{offer.client.first_name + " " + offer.client.last_name}</div>
          </div>

          {/* Agent Créateur */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Agent Créateur</label>
            <div className="font-semibold">{offer.client.last_name}</div>
          </div>

          {/* Statut de l'Offre */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Statut de l'Offre</label>
            <div className="font-semibold">
              <StatusBadge status={offer.status} />
            </div>
          </div>

          {/* Conditions Spécifiques */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Conditions Spécifiques</label>
            <div className="text-sm leading-relaxed">{offer.conditions}</div>
          </div>

          {/* Commentaires Internes */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Commentaires Internes</label>
            <div className="text-sm leading-relaxed">{offer.comment}</div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-6 pt-0 border-t justify-center">
          <Link href={NAVIGATION_KEYS.OFFERS.EDIT(offer.id)}>
            <CustomButton text={translation(TRANSLATIONS_KEYS.COMMON.EDIT)} variant="ghost" className="w-42" />
          </Link>
          <CustomButton text={translation(TRANSLATIONS_KEYS.COMMON.PRINT)} className="w-42" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
