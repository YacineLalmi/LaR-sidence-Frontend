"use client";

import { useState, useRef, useEffect } from "react";
import { X, FileText, FileSearch, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CustomButton from "@/components/ui/custom-button";
import { Client } from "@/schemas/clients/client.schema";
import { getFileBlob } from "@/actions/files/get-file-blob.action";
import { StatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Media } from "@/schemas/global/media.schema";
import getClientDetailsAction from "@/actions/clients/get-client-details";
import { getMediaAsBlobAction } from "@/actions/media/get-media.actions";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Props {
  client: Client;
}

export default function ClientDocumentDialog({ client }: Props) {
  const [open, setOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState<Client | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const translation = useTranslations();
  const locale = useLocale() as "fr" | "en" | "ar";
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      setIsLoading(true);
      try {
        const details = await getClientDetailsAction(client.id, {
          include: "agent,type,status,media",
        });
        setClientDetails(details.data);
      } catch (error) {
        console.error("Error fetching client details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchClientDetails();
    }
  }, [open]);

  const handleDownloadDocument = async (doc: Media) => {
    const blob = await getMediaAsBlobAction(doc);
    if (!blob) return;

    const binaryString = window.atob(blob.base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const file = new File([bytes], doc.file_name, { type: doc.mime_type });
    const url = URL.createObjectURL(file);

    const a = document.createElement("a");
    a.href = url;
    a.download = doc.file_name;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handlePrint = (client: Client | undefined) => {
    if (!client) return;
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
                    ? client.documents.map((doc) => `<div class="print-doc-item">• ${doc.file_name}</div>`).join("")
                    : '<div class="print-value">Aucun document</div>'
                }
              </div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Email</div>
              <div class="print-value">${client.email || "N/A"}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Téléphone</div>
              <div class="print-value">${client.mobile}</div>
            </div>
            
            <div class="print-field">
              <div class="print-label">Statut</div>
              <div class="print-status" style="background-color: ${getStatusColor(client.status?.name.fr || "active")};">
                ${client.status?.name[locale] || "N/A"}
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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="px-6 min-h-[400px] flex items-center justify-center">
          <p>Chargement en cours...</p>
        </div>
      );
    }

    if (!clientDetails) {
      return (
        <div className="px-6 min-h-[400px] flex items-center justify-center">
          <p>Impossible de charger les détails du client.</p>
        </div>
      );
    }

    return (
      <div ref={printRef} className="grid grid-cols-2 gap-3">
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <DataField label="ID du client" value={clientDetails.id} bold />
          <DataField label="Civilité" value={clientDetails.civility} bold />
          <DataField label="Nom et Prénom" value={clientDetails.first_name + " " + clientDetails.last_name} bold />
          <DataField label="Email" value={clientDetails.email || "N/A"} bold />
          <DataField label="Téléphone" value={clientDetails.mobile || "N/A"} bold />
          <StatusBadge status={clientDetails.status} />
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <DataField label="Réseaux du Client" value={clientDetails.source?.name[locale] || "N/A"} bold />{" "}
          {/* Documents */}
          <div>
            <label className="text-xs text-gray-500 block mb-3">Documents du Client</label>
            {clientDetails.documents && clientDetails.documents?.length > 0 ? (
              <Carousel className="w-full px-6">
                <CarouselContent>
                  {clientDetails.documents.map((doc, index) => (
                    <CarouselItem key={index} className="basis-1/2">
                      <DocCard
                        key={doc.id}
                        doc={doc}
                        isLoading={isLoading}
                        onClick={() => handleDownloadDocument(doc)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
              </Carousel>
            ) : (
              <p className="text-sm text-gray-500">Aucun document</p>
            )}
          </div>
          <DataField label="Date et Heure" value={format(clientDetails.created_at, "dd-MM-yyyy HH:mm")} bold />
          <DataField label="Commentaires internes" value={client.comment || "pas de commentaire"} bold />
        </div>
      </div>
    );
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

        {renderContent()}

        {/* Footer */}
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
            onClick={() => handlePrint(clientDetails)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DocCard({ doc, isLoading, onClick }: { doc: Media; isLoading: boolean; onClick: () => void }) {
  const isPdf = doc.mime_type === "application/pdf";
  const isWord =
    doc.mime_type === "application/msword" ||
    doc.mime_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isImage = doc.mime_type.startsWith("image/");

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="flex flex-col items-center gap-1.5 w-20 group cursor-pointer disabled:opacity-50"
    >
      <div className="p-3 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center w-14 h-14 group-hover:border-amber-400 group-hover:shadow-md transition-all">
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        ) : isPdf ? (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <path
              d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
              fill="#FF3B30"
              opacity="0.15"
              stroke="#FF3B30"
              strokeWidth="1.5"
            />
            <path d="M14 2v5h5" stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round" />
            <text x="5" y="18" fontSize="5.5" fontWeight="bold" fill="#FF3B30" fontFamily="sans-serif">
              PDF
            </text>
          </svg>
        ) : isWord ? (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <path
              d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
              fill="#2B579A"
              opacity="0.15"
              stroke="#2B579A"
              strokeWidth="1.5"
            />
            <path d="M14 2v5h5" stroke="#2B579A" strokeWidth="1.5" strokeLinecap="round" />
            <text x="4" y="18" fontSize="5" fontWeight="bold" fill="#2B579A" fontFamily="sans-serif">
              DOC
            </text>
          </svg>
        ) : isImage ? (
          <ImageIcon className="w-7 h-7 text-emerald-500" />
        ) : (
          <FileText className="w-7 h-7 text-zinc-400" />
        )}
      </div>
      <span className="text-xs font-medium text-zinc-500 text-center leading-tight line-clamp-2 w-full group-hover:text-zinc-800 transition-colors">
        {doc.name}
      </span>
    </button>
  );
}

function DataField({ label, value, bold }: { label: string; value?: string | undefined; bold?: boolean }) {
  return (
    <div className="border-b text-xs border-zinc-200">
      <p className="text-zinc-400 uppercase font-semibold">{label}</p>
      <p className={bold ? "font-bold" : "font-medium"}>{value || "N/A"}</p>
    </div>
  );
}
