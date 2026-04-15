"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { createClientAction } from "@/actions/clients/create-client.action";
import { ClientForm as ClientFormType } from "@/schemas/clients/client-form.schema";
import ClientForm from "./client-form";
import { Client } from "@/schemas/clients/client.schema";

type CreateClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated: (client: Client) => void;
};

export default function CreateClientDialog({ open, onOpenChange, onClientCreated }: CreateClientDialogProps) {
  const translation = useTranslations();

  const initialData: ClientFormType = {
    civility: "mrs",
    last_name: "",
    first_name: "",
    source_id: "",
    email: "",
    phone_numbers: [],
    documents: [],
    comment: "",
    company_name: "",
    trade_register: "",
    tax_identification: "",
    mobile: "",
    ai: "",
    status_id: "",
    type_id: "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-4xl max-h-[95vh] overflow-y-auto"
        // Prevent closing when clicking outside the modal
        onPointerDownOutside={(e) => e.preventDefault()}
        // Optional: Prevent closing when pressing the Escape key
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.TITLES.CREATE)}</DialogTitle>
        </DialogHeader>
        <ClientForm
          initialData={initialData}
          submitAction={createClientAction}
          successAction={onClientCreated}
          successMessage={TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.CREATED}
          errorMessage={TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.FAILED_CREATION}
        />
      </DialogContent>
    </Dialog>
  );
}
