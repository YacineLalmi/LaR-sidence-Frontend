"use client";

import React, { useState, useRef } from "react";
import { FileSearch, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomButton from "@/components/ui/custom-button";
import { Demand } from "@/schemas/demands/demand.schema";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { useLocale, useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

interface Props {
  demand: Demand;
}

export default function DemandDocumentDialog({ demand }: Props) {
  const translation = useTranslations();
  const [open, setOpen] = useState(false);
  const locale = useLocale() as "fr" | "en" | "ar";
  const printRef = useRef<HTMLDivElement>(null);

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
        <title>Fiche Demande - ${demand.id}</title>
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
          
          .print-column {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          
          .print-field {
            border-bottom: 2px solid #e5e7eb;
            padding: 8px;
          }
          
          .print-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 6px;
          }
          
          .print-value {
            font-size: 14px;
            font-weight: 500;
            color: #111827;
          }
          
          .print-value-bold {
            font-weight: 600;
            font-size: 16px;
          }
          
          .print-status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
          }
          
          .print-description {
            font-size: 14px;
            line-height: 1.6;
            color: #1f2937;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <h1 class="print-title">Fiche Demande</h1>
          </div>
          
          <div class="print-grid">
            <!-- Left Column -->
            <div class="print-column">
              <div class="print-field">
                <div class="print-label">ID de la demande</div>
                <div class="print-value print-value-bold">#${demand.id}</div>
              </div>
              
              <div class="print-field">
                <div class="print-label">Type de la Demande</div>
                <div class="print-value">${demand.type?.name[locale] || "N/A"}</div>
              </div>
              
              <div class="print-field">
                <div class="print-label">Client Concerné</div>
                <div class="print-value print-value-bold">${demand.client?.first_name || ""} ${demand.client?.last_name || ""}</div>
              </div>
              
              <div class="print-field">
                <div class="print-label">Bien Concerné</div>
                <div class="print-value">${demand.bien?.title || "N/A"}</div>
              </div>
              
              <div class="print-field">
                <div class="print-label">Statut de la demande</div>
                <div class="print-status" style="background-color: ${getStatusColor(demand.status?.name[locale])};">
                  ${demand.status}
                </div>
              </div>
              
              <div class="print-field">
                <div class="print-label">Budget</div>
                <div class="print-value print-value-bold">${demand.budget ? demand.budget.toLocaleString() + " DA" : "N/A"}</div>
              </div>
              
              <div class="print-field">
                <div class="print-label">Priorité</div>
                <div class="print-value">${demand.priority?.name[locale] || "N/A"}</div>
              </div>
              
              <div class="print-field">
                <div class="print-label">Agent Attribué</div>
                <div class="print-value">${demand.agent?.first_name || ""} ${demand.agent?.last_name || ""}</div>
              </div>
            </div>
            
            <!-- Right Column -->
            <div class="print-column">
              <div class="print-field">
                <div class="print-label">Source de la demande</div>
                <div class="print-value print-value-bold">${demand.source?.name[locale] || "N/A"}</div>
              </div>
              
              <div class="print-field" style="min-height: 150px;">
                <div class="print-label">Commentaires internes</div>
                <div class="print-description">${demand.comment || "Aucun commentaire"}</div>
              </div>
            </div>
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
  const getStatusColor = (status: string | undefined) => {
    if (!status) {
      return;
    }
    const statusColors: Record<string, string> = {
      Ouvert: "#dbeafe",
      "En cours": "#fef9c3",
      Fermé: "#dcfce7",
      "En Attente": "#fff9e6",
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
        <DialogHeader className="p-6 pb-4 relative flex justify-between flex-row items-start">
          <DialogTitle className="text-2xl font-light text-amber-600">Fiche demande</DialogTitle>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full bg-black text-white p-1.5 hover:bg-gray-800 transition-colors"
          >
            <X size={18} />
          </button>
        </DialogHeader>

        <div ref={printRef} className="px-6 pb-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
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
                <div className="font-medium text-sm">{demand.type?.name[locale]}</div>
              </div>

              {/* Client Name */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Client Concerné</label>
                <div className="font-semibold text-base">
                  {demand.client?.first_name + " " + demand.client?.last_name}
                </div>
              </div>

              {/* Bien Title */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Bien Concerné</label>
                <div className="font-medium text-sm">{demand.bien?.title}</div>
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
                <div className="font-medium text-base">{demand.priority?.name[locale]}</div>
              </div>

              {/* Agent */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Agent Attribué</label>
                <div className="font-medium text-base">{demand.agent?.first_name + " " + demand.agent?.last_name}</div>
              </div>
            </div>
            <div>
              {/* Source */}
              <div className="border-b-2 p-2">
                <label className="text-xs text-gray-500 block mb-1.5">Source de la demand</label>
                <div className="font-semibold text-base">{demand.source?.name[locale]}</div>
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
          <Link href={ROUTES.DEMANDS.EDIT(demand.id)}>
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
