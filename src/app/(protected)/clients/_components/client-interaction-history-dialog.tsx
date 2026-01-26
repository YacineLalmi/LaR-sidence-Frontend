import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Trash2, Edit, X, History } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";
import { Interaction } from "@/schemas/interaction/interaction";
import { format } from "date-fns";

interface Props {
  interactions: Interaction[];
}

export default function ClientInteractionHistoryDialog({ interactions }: Props) {
  const [open, setOpen] = useState(false);

  // const interactions = [
  //   {
  //     id: 1,
  //     date: "12/07/2025 - 14h10",
  //     agent: "Abdeljdlil Hachemi",
  //     type: "Appel",
  //     typeColor: "bg-blue-100 text-blue-700",
  //   },
  //   {
  //     id: 2,
  //     date: "09/07/2025 - 10h45",
  //     agent: "Automatique",
  //     type: "Email",
  //     typeColor: "bg-purple-100 text-purple-700",
  //   },
  //   {
  //     id: 3,
  //     date: "05/07/2025 - 16h30",
  //     agent: "Nacer Amira",
  //     type: "Visite",
  //     typeColor: "bg-yellow-100 text-yellow-700",
  //   },
  //   {
  //     id: 4,
  //     date: "12/07/2025 - 14h10",
  //     agent: "Yacine Ialmi",
  //     type: "Appel",
  //     typeColor: "bg-blue-100 text-blue-700",
  //   },
  //   {
  //     id: 5,
  //     date: "05/07/2025 - 16h30",
  //     agent: "Abdelmalek Khaled",
  //     type: "Visite",
  //     typeColor: "bg-yellow-100 text-yellow-700",
  //   },
  //   {
  //     id: 6,
  //     date: "05/07/2025 - 16h30",
  //     agent: "Automatique",
  //     type: "Email",
  //     typeColor: "bg-purple-100 text-purple-700",
  //   },
  // ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton Icon={History} size="icon" variant="ghost" className="!p-0 size-8" />
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="!max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <div className="relative">
          <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-orange-50 to-amber-50">
            <DialogTitle className="text-2xl text-amber-500 underline flex items-center gap-2">
              Historique des interactions
            </DialogTitle>
          </DialogHeader>
          <CustomButton
            Icon={X}
            size="icon"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 size-8 !p-0"
          />
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-600">
              <div>Date et Heure</div>
              <div>Agent Responsable</div>
              <div>Type de l'interaction</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="divide-y">
              {interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  <div className="text-sm text-gray-700">{format(interaction.created_at, "dd/MM/yyyy - HH:mm")}</div>
                  <div className="text-sm text-gray-900 font-medium">{interaction.user}</div>
                  <div>
                    <span
                      // className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${interaction.typeColor}`}
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium`}
                    >
                      {interaction.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0 size-8" />
                    <CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0 size-8" />
                    {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                      <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                      <Edit className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
