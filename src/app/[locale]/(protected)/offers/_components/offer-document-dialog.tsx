"use client";

import { useState, useRef } from "react";
import { FileSearch, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Offer } from "@/schemas/offers/offer.schema";
import CustomButton from "@/components/ui/custom-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  offer: Offer;
}

export default function OfferDocumentDialog({ offer }: Props) {
  const [open, setOpen] = useState(false);
  const translation = useTranslations();
  const printRef = useRef<HTMLDivElement>(null);

  const locale = useLocale() as "fr" | "en" | "ar";

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Get the computed styles
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          return "";
        }
      })
      .join("\n");

    // Write the HTML content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fiche Offre - ${offer.id}</title>
        <style>
          ${styles}
          
          /* Print-specific styles */
          @media print {
            @page {
              margin: 1.5cm;
              size: A4;
            }
            
            body {
              margin: 0;
              padding: 20px;
            }
            
            .no-print {
              display: none !important;
            }
            
            .print-container {
              max-width: 100% !important;
              box-shadow: none !important;
            }
          }
          
          /* Additional styling for print layout */
          .print-container {
            font-family: system-ui, -apple-system, sans-serif;
          }
          
          .print-header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          
          .print-title {
            font-size: 28px;
            font-weight: 600;
            color: #d97706;
            margin: 0;
          }
          
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .print-field {
            margin-bottom: 16px;
          }
          
          .print-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
          }
          
          .print-value {
            font-size: 15px;
            font-weight: 500;
            color: #111827;
          }
          
          .print-value-bold {
            font-weight: 600;
            font-size: 16px;
          }
          
          .print-value-large {
            font-weight: 700;
            font-size: 18px;
          }
          
          .print-status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
          }
          
          .print-text-section {
            background-color: #f9fafb;
            padding: 12px;
            border-radius: 6px;
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <h1 class="print-title">Fiche Offre</h1>
          </div>
          
          <div class="print-grid">
            <div class="print-field">
              <div class="print-label">ID de l'Offre</div>
              <div class="print-value print-value-large">${offer.id}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Date de Création</div>
              <div class="print-value print-value-bold">${format(offer.created_at, "dd-MM-yyyy HH:mm")}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Bien Associé</div>
              <div class="print-value print-value-bold">${offer.bien?.title}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Date de Dernière Modification</div>
              <div class="print-value print-value-bold">${offer.updated_at ? format(offer.updated_at, "dd-MM-yyyy HH:mm") : "N/A"}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Client</div>
              <div class="print-value print-value-bold">${offer.client?.first_name} ${offer.client?.last_name}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Agent Créateur</div>
              <div class="print-value print-value-bold">${offer.client?.last_name}</div>
            </div>
          </div>
          
          <div class="print-field" style="margin-bottom: 24px;">
            <div class="print-label">Statut de l'Offre</div>
            <div class="print-status" style="background-color: ${getStatusColor(offer.status?.name[locale] || "N/A")};">
              ${offer.status?.name[locale]}
            </div>
          </div>
          ?
          <div class="print-field" style="margin-bottom: 24px;">
            <div class="print-label">Conditions Spécifiques</div>
            <div class="print-text-section">${offer.conditions || "Aucune condition spécifique"}</div>
          </div>
          
          <div class="print-field">
            <div class="print-label">Commentaires Internes</div>
            <div class="print-text-section">${offer.comment || "Aucun commentaire"}</div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      "En Attente": "#fff9e6",
      Acceptée: "#e6f7e6",
      Refusée: "#ffe6e6",
      "En Cours": "#e6f2ff",
      // Add more status colors as needed
    };
    return statusColors[status] || "#f5f5f5";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton Icon={FileSearch} size="icon" variant="ghost" className="!p-0" />
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 gap-0" showCloseButton={false}>
        <DialogHeader className="p-6 pb-0 relative flex justify-between flex-row">
          <DialogTitle className="text-2xl font-light text-amber-600">Fiche Offre</DialogTitle>
          <CustomButton Icon={X} size="icon" className="!p-0" onClick={() => setOpen(false)} />
        </DialogHeader>

        {/* Content */}
        <div ref={printRef} className="px-8 py-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* ID de l'Offre & Date de Création */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-gray-500 block mb-1">ID de l'Offre</label>
              <div className="font-bold text-lg">{offer.id}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Date de Création</label>
              <div className="font-semibold">{format(offer.created_at, "dd-MM-yyyy HH:mm")}</div>
            </div>
          </div>

          {/* Bien Associé & Date de Dernière Modification */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Bien Associé</label>
              <div className="font-semibold">{offer.bien?.title}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Date de Dernière Modification</label>
              <div className="font-semibold">{offer.updated_at && format(offer.updated_at, "dd-MM-yyyy HH:mm")}</div>
            </div>
          </div>

          {/* Client */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Client</label>
            <div className="font-semibold">{offer.client?.first_name + " " + offer.client?.last_name}</div>
          </div>

          {/* Agent Créateur */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Agent Créateur</label>
            <div className="font-semibold">{offer.client?.last_name}</div>
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
          <Link href={ROUTES.OFFERS.EDIT(offer.id)}>
            <CustomButton
              text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.EDIT)}
              variant="ghost"
              className="w-42"
            />
          </Link>
          <CustomButton
            text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.PRINT)}
            className="w-42"
            onClick={handlePrint}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
