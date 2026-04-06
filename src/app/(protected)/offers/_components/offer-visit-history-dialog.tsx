import React, { useState } from "react";
import { History, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomButton from "@/components/ui/custom-button";
import { Visit } from "@/schemas/visit/visit.schema";
import VisitCard from "./visit-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  visits: Visit[] | undefined;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function OfferVisitHistoryDialog({ visits }: Props) {
  const [open, setOpen] = useState(false);

  if (!visits) return;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton Icon={History} size="icon" variant="ghost" className="!p-0 size-7" />
        {/* <Button variant="outline" size="icon" className="rounded-full" aria-label="Voir l'historique des visites">
          <History className="h-4 w-4" />
        </Button> */}
      </DialogTrigger>

      <DialogContent showCloseButton={false} className="max-w-2xl max-h-[90vh] p-0 gap-2">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-normal text-amber-600">Historique des visites</DialogTitle>
        </DialogHeader>
        <CustomButton
          Icon={X}
          size="icon"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 size-8 !p-0"
        />

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="px-6 py-2">
            {visits.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-500">Aucune visite enregistrée</p>
              </div>
            ) : (
              <div>
                {visits.map((visit) => (
                  <VisitCard key={visit.id} visit={visit} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
