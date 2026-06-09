"use client";

import { X, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from "@/schemas/events/event.schema";
import { format } from "date-fns";
import CustomButton from "@/components/ui/custom-button";
import { Link } from "@/i18n/navigation";
import DeleteEventDialog from "./delete-event-dialog";
import { ROUTES } from "@/constants/routes";
import { useLocale } from "next-intl";

interface EventDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

export default function ViewEventDialog({ open, onOpenChange, event, onEdit, onDelete }: EventDetailDialogProps) {
  if (!event) return null;

  const locale = useLocale() as "fr" | "en" | "ar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-[#E8E5E0] border-none" showCloseButton={false}>
        <DialogHeader className="px-8 pt-8 pb-6 space-y-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <DialogTitle className="text-2xl font-medium text-gray-900">{event.title}</DialogTitle>
              <Link href={ROUTES.EVENTS.EDIT(event.id)}>
                <CustomButton Icon={Edit2} size="icon" variant="ghost" />
              </Link>
              <DeleteEventDialog event={event} />
            </div>
            <CustomButton Icon={X} size="icon" onClick={() => onOpenChange(false)} />
          </div>
        </DialogHeader>

        <div className="px-8 pb-8 space-y-4">
          <div className="grid grid-cols-[160px_1fr] gap-y-3 text-sm">
            <span className="text-gray-500">Date/Heure de début</span>
            <span className="text-gray-900 font-medium">{format(event.start_date, "PPP")}</span>

            <span className="text-gray-500">Date/Heure de fin</span>
            <span className="text-gray-900 font-medium">{format(event.end_date, "PPP")}</span>

            <span className="text-gray-500">Type d'événement</span>
            <span className="text-gray-900">{event.type?.name[locale] || "-"}</span>

            <span className="text-gray-500">Agent(s) participant(s)</span>
            <span className="text-gray-900">
              {event.agent?.first_name} {event.agent?.last_name}
            </span>

            {event.bien && (
              <>
                <span className="text-gray-500">Bien concerné</span>
                <span className="text-gray-900">
                  {event.bien.id} {event.bien.deleted_at && "(supprimé)"}{" "}
                </span>
              </>
            )}

            {event.client && (
              <>
                <span className="text-gray-500">Client concerné</span>
                <span className="text-gray-900">
                  {event.client?.first_name} {event.client?.last_name}
                </span>
              </>
            )}

            <span className="text-gray-500 self-start">Description</span>
            <span className="text-gray-900 leading-relaxed">{event.description}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
