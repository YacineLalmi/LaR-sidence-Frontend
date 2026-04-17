"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { customToast } from "@/lib/utils";
import { LibraryFile } from "@/schemas/documents/library-file.schema";
import { shareDocumentEmailAction } from "@/actions/documents/share-document-email.action";
import { shareDocumentLinkAction } from "@/actions/documents/share-document-link.action";
import { Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

type Props = {
  file: LibraryFile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function DocumentShareModal({ file, open, onOpenChange }: Props) {
  const t = useTranslations("documents.share_modal");
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const displayName = file?.display_name || file?.original_name || "";

  const onSendEmail = () => {
    if (!file || !email.trim()) {
      customToast.error(t("email_required"));
      return;
    }
    startTransition(async () => {
      const res = await shareDocumentEmailAction(file.id, email.trim());
      if (res.isOk) {
        customToast.success(t("email_sent"));
        setEmail("");
        onOpenChange(false);
      } else {
        customToast.error(res.errorMessage || t("error"));
      }
    });
  };

  const onWhatsApp = () => {
    if (!file) return;
    startTransition(async () => {
      const res = await shareDocumentLinkAction(file.id);
      if (!res.ok) {
        customToast.error(res.message);
        return;
      }
      const text = t("whatsapp_message", { name: displayName, url: res.url });
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md rounded-[28px] border-stone-200 bg-[#F9F8F3] p-0 gap-0 overflow-hidden"
      >
        <DialogHeader className="relative p-6 pb-2 text-left space-y-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white hover:bg-stone-800"
            aria-label={t("close")}
          >
            <X className="h-4 w-4" />
          </button>
          <DialogTitle className="text-xl font-bold text-foreground pr-10">{t("title")}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-6 pb-6">
          <div className="flex gap-2 rounded-full border border-stone-300 bg-white pl-4 pr-1 py-1">
            <Input
              type="email"
              placeholder={t("email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 h-10 rounded-full bg-transparent"
              onKeyDown={(e) => e.key === "Enter" && onSendEmail()}
            />
            <Button
              type="button"
              onClick={onSendEmail}
              disabled={isPending}
              className="rounded-full shrink-0 bg-black text-white hover:bg-stone-800 px-5"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("send")}
            </Button>
          </div>
          <Button
            type="button"
            variant="default"
            onClick={onWhatsApp}
            disabled={isPending}
            className="w-full h-12 rounded-2xl bg-black text-white hover:bg-stone-800 justify-between px-5"
          >
            <span>{t("whatsapp")}</span>
            <WhatsAppGlyph className="h-7 w-7 text-[#25D366]" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
