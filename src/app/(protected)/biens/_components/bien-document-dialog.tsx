"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, MapPin, MessageCircle, FileText, FileSearch } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";
import { Bien } from "@/schemas/biens/bien.schema";

// Mock data based on your image
const PROPERTY_DATA = {
  id: "#20462",
  title: "Villa vue de mer",
  type: "Villa",
  status: "Libre",
  transaction: "Vente",
  price: "75.000.000.00DA",
  charges: "(nul)",
  exclusivity: "Non",
  agent: "Abdeljalil hachemi",
  wilaya: "Alger",
  commune: "Hydra",
  zip: "16000",
  address: "141 cite belle vue",
  description: "Située dans un quartier résidentiel prisé, cette villa offre une vue dégagée sur la mer...",
  creationDate: "13/05/2022",
  // Page 2 data
  livingArea: "200 m²",
  totalArea: "350 m²",
  devArea: "350 m²",
  floors: "2",
  rooms: "8",
  bathrooms: "2",
  bedrooms: "3",
  availability: "13/05/2022",
  priority: "Moyenne",
  features: ["Climatisation", "Chauffage central", "Parking", "Jardin", "Piscine"],
  comment: "Bien très demandé, idéalement situé à proximité du centre-ville...",
};

interface Props {
  bien: Bien;
}
export default function FicheBienDialog({ bien }: Props) {
  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton Icon={FileSearch} size="icon" variant="ghost" className="!p-0" />
      </DialogTrigger>
      <DialogContent
        className="!max-w-2xl w-2xl p-0 overflow-hidden bg-[#F5F2EB] border-none shadow-2xl rounded-3xl"
        showCloseButton={false}
      >
        {/* Custom Header with Close Button */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-2xl font-serif text-[#C5A267]">Fiche Bien</h2>
          <DialogClose className="rounded-full bg-black p-2 text-white hover:opacity-80 transition-opacity">
            <X className="h-5 w-5" />
          </DialogClose>
        </div>

        <div className="px-6 min-h-[400px]">{page === 1 ? <PageOne data={bien} /> : <PageTwo data={bien} />}</div>

        {/* Footer with Pagination and Actions */}
        <div className="flex items-center justify-between p-2 bg-transparent">
          {/* Pagination Controls */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(1)}
                className={`w-8 h-8 rounded-md border ${page === 1 ? "bg-[#E5DCC5] border-[#C5A267]" : "bg-white border-gray-200"}`}
              >
                1
              </button>
              <button
                onClick={() => setPage(2)}
                className={`w-8 h-8 rounded-md border ${page === 2 ? "bg-[#E5DCC5] border-[#C5A267]" : "bg-white border-gray-200"}`}
              >
                2
              </button>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setPage(2)} disabled={page === 2}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-end gap-3">
            <Button className="bg-black hover:bg-zinc-800 text-white rounded-xl px-6 py-6 w-full flex gap-2">
              Envoyer sur WhatsApp <MessageCircle className="h-5 w-5 fill-green-500 text-green-500" />
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="border-zinc-300 rounded-xl px-8 h-12">
                Modifier
              </Button>
              <Button className="bg-black hover:bg-zinc-800 text-white rounded-xl px-8 h-12">Imprimer</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** ─── PAGE 1 CONTENT ─── **/
function PageOne({ data }: { data: Bien }) {
  return (
    <div className="grid grid-cols-2 gap-12">
      {/* Left Column */}
      <div className="space-y-2">
        <div>
          <p className="text-xs text-zinc-400 mb-2 uppercase tracking-widest font-semibold">Images du Bien</p>
          <div className="relative aspect-video rounded-3xl overflow-hidden group w-72 mx-auto">
            <Image src="/property-placeholder.jpg" alt="Bien" className="object-cover" fill />
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="rounded-full w-8 h-8">
                <ChevronLeft />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full w-8 h-8">
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
        <DataField label="ID du bien" value={data.id.toString()} bold />
        <DataField label="Titre du bien" value={data.title || "N/A"} bold />
        <DataField label="Type de bien" value={data.type.name} bold />
        <DataField label="Statut du bien" value={data.status.name} bold />
        <DataField label="Type de transaction" value={data.transaction_type.name} bold />
        <DataField label="Prix de vente" value={data.price.toString()} bold />
        <DataField label="Charges mensuelles" value={data.monthly_charges.toString()} />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <DataField label="Exclusivité" value={data.exclusivity ? "Oui" : "Non"} bold />
        <DataField label="Agent responsable" value={data.agent.first_name} bold />
        <DataField label="Wilaya" value={data.wilaya.name} bold />
        <DataField label="Commune" value={data.commune.name} bold />
        <DataField label="Code postale" value={data.postal_code} bold />
        <div className="relative border-b border-zinc-200 pb-2">
          <p className="text-xs text-zinc-400 uppercase font-semibold">Adresse</p>
          <p className="font-bold flex items-center justify-between">
            {data.adresse} <MapPin className="h-4 w-4" />
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-zinc-400 uppercase font-semibold">Description</p>
          <p className="text-sm leading-relaxed font-medium">{data.description}</p>
        </div>
        <DataField label="Date de Création" value={data.created_at} />
      </div>
    </div>
  );
}

/** ─── PAGE 2 CONTENT ─── **/
function PageTwo({ data }: { data: Bien }) {
  return (
    <div className="grid grid-cols-2 gap-12">
      {/* Left Column */}
      <div className="space-y-3">
        <DataField label="Surface Habitable (m²)" value={data.habitable_surface.toString()} bold />
        <DataField label="Surface Totale (m²)" value={data.total_surface.toString()} bold />
        <DataField label="Surface Développée (m²)" value={data.developed_surface?.toString() || "N/A"} bold />
        <DataField label="Nombre d'Etages" value={data.floor_number.toString()} bold />
        <DataField label="Nombre de Pièces" value={data.rooms_number.toString()} bold />
        <DataField label="Nombre de Salles de Bain" value={data.bathrooms_number.toString()} bold />
        <DataField label="Nombre de Chambres" value={data.bedrooms_number.toString()} bold />
        <DataField label="Date de Disponibilité" value={data.availability_date} bold />

        <div className="space-y-2">
          <p className="text-xs text-zinc-400 uppercase font-semibold">Caractéristiques Additionnelles</p>
          <ul className="text-sm font-bold space-y-1">
            {data.additional_characteristics.map((f) => (
              <li key={f.id}>• {f.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-2">
        <DataField label="Priorité" value={data.priority.name} bold />

        <div>
          <p className="text-xs text-zinc-400 uppercase font-semibold mb-3">Documents du Bien</p>
          <div className="flex gap-4">
            <FileIcon name="Facture.pdf" />
            <FileIcon name="Contrat.pdf" />
            <FileIcon name="Facture.pdf" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-zinc-400 uppercase font-semibold">Commentaire</p>
          <p className="text-sm font-bold leading-tight">{data.comment}</p>
        </div>
      </div>
    </div>
  );
}

/** ─── REUSABLE UI COMPONENTS ─── **/

function DataField({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="border-b text-xs border-zinc-200">
      <p className="text-zinc-400 uppercase font-semibold">{label}</p>
      <p className={bold ? "font-bold" : "font-medium"}>{value}</p>
    </div>
  );
}

function FileIcon({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="p-3 bg-white rounded-xl shadow-sm border border-zinc-100">
        <FileText className="h-6 w-6 text-zinc-600" />
      </div>
      <span className="text-xs font-medium text-zinc-500">{name}</span>
    </div>
  );
}
