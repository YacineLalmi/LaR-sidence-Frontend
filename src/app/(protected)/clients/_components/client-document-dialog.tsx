"use client";

import React, { useState } from "react";
import { X, FileText, FileSearch } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/custom-button";
import { Client } from "@/schemas/clients/client.schema";
import { getFileBlob } from "@/actions/files/get-file-blob.action";
import { FileBlob } from "@/schemas/file/file-blob.schema";
import { File } from "@/schemas/file/file.schema";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";
import Link from "next/link";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  client: Client;
}
export default function ClientDocumentDialog({ client }: Props) {
  const [open, setOpen] = useState(false);
  const translation = useTranslations();

  const handleDownloadDocument = async (doc: File) => {
    try {
      const result = await getFileBlob(doc.id);
      const res = await fetch(`data:${doc.mime_type};base64,${result}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.original_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton Icon={FileSearch} size="icon" variant="ghost" className="!p-0" />
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 gap-0" showCloseButton={false}>
        <DialogHeader className="p-6 pb-0 relative flex justify-between flex-row">
          <DialogTitle className="text-2xl font-light text-amber-600">Fiche Client</DialogTitle>
          <CustomButton Icon={X} size="icon" className="!p-0" onClick={() => setOpen(false)} />
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* ID du client */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">ID du client</label>
              <div className="font-semibold">{client.id}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Réseaux du Client</label>
              <div className="font-medium">{client.source.name}</div>
            </div>
          </div>

          {/* Civilité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Civilité</label>
              <div className="font-medium">{client.civility}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Type de Réseau</label>
              <div className="font-medium">{client.type.name}</div>
            </div>
          </div>

          {/* Nom et Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Nom et Prénom</label>
              <div className="font-semibold">{client.first_name + " " + client.last_name}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Documents du Client</label>
              <div className="flex gap-2">
                {client.documents.map((doc, index) => (
                  <button
                    key={index}
                    onClick={() => handleDownloadDocument(doc)}
                    className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity"
                    title={doc.original_name}
                  >
                    <FileText size={32} className="text-gray-700" />
                    <span className="text-xs text-gray-600">{doc.original_name}</span>
                  </button>
                ))}
                {client.documents.length === 0 && "no documents"}
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <div className="font-medium">{client.email}</div>
          </div>

          {/* Téléphone */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Téléléphone</label>
            <div className="font-medium">{client.mobile}</div>
          </div>

          {/* Statut */}
          <div>
            <StatusBadge status={client.status} />
          </div>

          {/* Date et Heure */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Date et Heure</label>
            <div className="font-medium">{format(client.created_at, "dd-mm-yyy HH:MM")}</div>
          </div>

          {/* Commentaires */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Commentaires internes</label>
            <div className="text-sm">{!!client.comment ? client.comment : "pas de commentaire"}</div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-6 pt-0 border-t justify-center">
          <Link href={NAVIGATION_KEYS.CLIENTS.EDIT(client.id)}>
            <CustomButton text={translation(TRANSLATIONS_KEYS.COMMON.EDIT)} variant="ghost" className="w-42" />
          </Link>
          <CustomButton text={translation(TRANSLATIONS_KEYS.COMMON.PRINT)} className="w-42" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
