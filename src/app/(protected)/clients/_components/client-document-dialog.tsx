"use client";

import React, { useState, useRef } from "react";
import { X, FileText, FileSearch } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomButton from "@/components/ui/custom-button";
import { Client } from "@/schemas/clients/client.schema";
import { getFileBlob } from "@/actions/files/get-file-blob.action";
import { File } from "@/schemas/file/file.schema";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  client: Client;
}

export default function ClientDocumentDialog({ client }: Props) {
  const [open, setOpen] = useState(false);
  const translation = useTranslations();
  const locale = useLocale() as "fr" | "en" | "ar";
  const printRef = useRef<HTMLDivElement>(null);

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
        <title>Fiche Client - ${client.first_name} ${client.last_name}</title>
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
          
          .print-documents {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          
          .print-doc-item {
            font-size: 13px;
            color: #374151;
          }
          
          .print-status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
          }
          
          .print-comments {
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <h1 class="print-title">Fiche Client</h1>
          </div>
          
          <div class="print-grid">
            <div class="print-field">
              <div class="print-label">ID du client</div>
              <div class="print-value print-value-bold">${client.id}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Réseaux du Client</div>
              <div class="print-value">${client.source?.name[locale] || "N/A"}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Civilité</div>
              <div class="print-value">${client.civility}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Type de Réseau</div>
              <div class="print-value">${client.type?.name[locale] || "N/A"}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Nom et Prénom</div>
              <div class="print-value print-value-bold">${client.first_name} ${client.last_name}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Documents du Client</div>
              <div class="print-documents">
                ${
                  client.documents && client.documents.length > 0
                    ? client.documents.map((doc) => `<div class="print-doc-item">• ${doc.original_name}</div>`).join("")
                    : '<div class="print-value">Aucun document</div>'
                }
              </div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Email</div>
              <div class="print-value">${client.email}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Téléphone</div>
              <div class="print-value">${client.mobile}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Statut</div>
              <div class="print-status" style="background-color: ${getStatusColor(client.status?.name.fr || "active")};">
                ${client.status}
              </div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Date et Heure</div>
              <div class="print-value">${format(client.created_at, "dd-MM-yyyy HH:mm")}</div>
            </div>
          </div>
          
          <div class="print-comments">
            <div class="print-field">
              <div class="print-label">Commentaires internes</div>
              <div class="print-value">${client.comment || "pas de commentaire"}</div>
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
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      Prospect: "#fff9e6",
      Client: "#e6f7ff",
      Inactif: "#f5f5f5",
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
          <DialogTitle className="text-2xl font-light text-amber-600">Fiche Client</DialogTitle>
          <CustomButton Icon={X} size="icon" className="!p-0" onClick={() => setOpen(false)} />
        </DialogHeader>

        {/* Content */}
        <div ref={printRef} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* ID du client */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">ID du client</label>
              <div className="font-semibold">{client.id}</div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Réseaux du Client</label>
              <div className="font-medium">{client.source?.name[locale] || "N/A"}</div>
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
              <div className="font-medium">{client.type?.name[locale] || "N/A"}</div>
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
                {client.documents &&
                  client.documents.map((doc, index) => (
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
                {client.documents && client.documents.length === 0 && "no documents"}
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
            <label className="text-xs text-gray-500 block mb-1">Téléphone</label>
            <div className="font-medium">{client.mobile}</div>
          </div>

          {/* Statut */}
          <div>
            <StatusBadge status={client.status} />
          </div>

          {/* Date et Heure */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Date et Heure</label>
            <div className="font-medium">{format(client.created_at, "dd-MM-yyyy HH:mm")}</div>
          </div>

          {/* Commentaires */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Commentaires internes</label>
            <div className="text-sm">{!!client.comment ? client.comment : "pas de commentaire"}</div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-6 pt-0 border-t justify-center">
          <Link href={ROUTES.CLIENTS.EDIT(client.id)}>
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
