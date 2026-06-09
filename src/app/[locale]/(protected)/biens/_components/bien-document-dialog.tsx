"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogClose, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, MessageCircle, FileText, FileSearch, ImageIcon } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";
import { Bien } from "@/schemas/biens/bien.schema";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/constants/routes";
import getBienDetailsAction from "@/actions/Bien/get-bien-details.action";
import { getMediaAsBlobAction } from "@/actions/media/get-media.actions";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Media } from "@/schemas/global/media.schema";

interface Props {
  bien: Bien;
}
export default function FicheBienDialog({ bien }: Props) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [BienDetails, setBienDetails] = useState<Bien | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [areImagesLoading, setAreImagesLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const locale = useLocale() as "fr" | "en" | "ar";

  useEffect(() => {
    const loadImages = async (bien: Bien) => {
      setAreImagesLoading(true);
      const imagePromises = bien.images?.map((img) => getMediaAsBlobAction(img)) || [];
      const images = await Promise.all(imagePromises);
      const validImages = images
        .filter((img) => !!img)
        .map((img) => {
          const binaryString = window.atob(img.base64);
          const bytes = new Uint8Array(binaryString.length);

          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return new File([bytes], img.name + "#" + img.uuid, { type: img.mimeType });
        });

      setImages(validImages);
      setAreImagesLoading(false);
    };

    if (open && !!BienDetails) {
      loadImages(BienDetails);
    }
  }, [open, BienDetails]);

  useEffect(() => {
    const fetchBienDetails = async () => {
      setIsLoading(true);
      try {
        const details = await getBienDetailsAction(bien.id, {
          include: "agent,characteristics,commune,wilaya,type,status,transaction_type,media",
        });
        setBienDetails(details.data);
      } catch (error) {
        console.error("Error fetching bien details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchBienDetails();
    }
    return () => {
      setPage(1);
    };
  }, [open]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="px-6 min-h-[400px] flex items-center justify-center">
          <p>Chargement en cours...</p>
        </div>
      );
    }

    if (!BienDetails) {
      return (
        <div className="px-6 min-h-[400px] flex items-center justify-center">
          <p>Impossible de charger les détails du bien.</p>
        </div>
      );
    }

    return (
      <>
        <div className="px-6 min-h-[400px]">
          {page === 1 ? (
            <PageOne data={BienDetails} images={images} areImagesLoading={areImagesLoading} />
          ) : (
            <PageTwo data={BienDetails} />
          )}
        </div>

        {/* Footer with Pagination and Actions */}
        <div className="flex items-center justify-between p-2 bg-transparent">
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

          <div className="flex flex-col items-end gap-3">
            <Button className="bg-black hover:bg-zinc-800 text-white rounded-xl px-6 py-6 w-full flex gap-2">
              Envoyer sur WhatsApp <MessageCircle className="h-5 w-5 fill-green-500 text-green-500" />
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="border-zinc-300 rounded-xl px-8 h-12">
                <Link href={ROUTES.BIENS.EDIT(bien.id)}>Modifier</Link>
              </Button>
              <Button
                className="bg-black hover:bg-zinc-800 text-white rounded-xl px-8 h-12"
                onClick={() => handlePrint(BienDetails, locale)}
              >
                Imprimer
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger is always rendered */}
      <DialogTrigger asChild>
        <CustomButton Icon={FileSearch} size="icon" variant="ghost" className="!p-0" />
      </DialogTrigger>

      <DialogContent
        className="!max-w-2xl w-2xl p-0 overflow-hidden bg-[#F5F2EB] border-none shadow-2xl rounded-3xl"
        showCloseButton={false}
      >
        {/* Header is always rendered */}
        <DialogTitle className="flex items-center justify-between p-6 pb-2 text-[#C5A267]">
          Fiche Bien
          <DialogClose className="rounded-full bg-black p-2 text-white hover:opacity-80 transition-opacity">
            <X className="size-4" />
          </DialogClose>
        </DialogTitle>

        {/* Content changes based on state */}
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

/** ─── PAGE 1 CONTENT ─── **/
function PageOne({ data, images, areImagesLoading }: { data: Bien; images: File[]; areImagesLoading: boolean }) {
  // Pre-create object URLs once when images change
  const imageUrls = useMemo(() => images.map((image) => URL.createObjectURL(image)), [images]);

  const locale = useLocale() as "fr" | "en" | "ar";
  return (
    <div className="grid grid-cols-2 gap-12">
      {/* Left Column */}
      <div className="space-y-2">
        <div>
          <p className="text-xs text-zinc-400 mb-2 uppercase tracking-widest font-semibold">Images du Bien</p>

          {areImagesLoading ? (
            <Card>
              <CardContent className="flex justify-center text-xs font-light">chargement...</CardContent>
            </Card>
          ) : images.length > 0 ? (
            <Carousel className="w-full relative">
              <CarouselContent>
                {imageUrls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-[200px] flex items-center justify-center bg-transparent rounded-xl overflow-hidden">
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="max-w-full max-h-full object-contain rounded-xl"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
            </Carousel>
          ) : (
            <Card>
              <CardContent className="flex justify-center text-xs font-light">Aucune image disponible</CardContent>
            </Card>
          )}
        </div>
        <DataField label="ID du bien" value={data.id.toString()} bold />
        {/* <DataField label="Titre du bien" value={data.title || "N/A"} bold /> */}
        <DataField label="Type de bien" value={data.type?.name[locale]} bold />
        <DataField label="Statut du bien" value={data.status?.name[locale]} bold />
        <DataField label="Type de transaction" value={data.transaction_type?.name[locale]} bold />
        <DataField label="Prix de vente" value={data.price?.toString()} bold />
        <DataField
          label="Charges mensuelles"
          value={data.monthly_charges ? data.monthly_charges.toString() : "N/A"}
          bold
        />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <DataField label="Exclusivité" value={data.exclusivity ? "Oui" : "Non"} bold />
        <DataField label="Agent responsable" value={data.agent?.first_name + " " + data.agent?.last_name} bold />
        <DataField label="Wilaya" value={data.wilaya?.name[locale]} bold />
        <DataField label="Commune" value={data.commune?.name[locale]} bold />
        <DataField label="Code postale" value={data.postal_code || undefined} bold />
        <DataField label="Adresse" value={data.adresse || "N/A"} bold />
        <DataField label="Description" value={data.description || "N/A"} bold />
        <DataField label="Date de Création" value={format(data.created_at, "dd-MM-yyyy")} bold />
      </div>
    </div>
  );
}

function PageTwo({ data }: { data: Bien }) {
  const locale = useLocale() as "fr" | "en" | "ar";

  return (
    <div className="grid grid-cols-2 gap-12">
      {/* Left Column — unchanged */}
      <div className="space-y-3">
        <DataField
          label="Surface Habitable (m²)"
          value={data.habitable_surface ? data.habitable_surface.toString() : "N/A"}
          bold
        />
        <DataField
          label="Surface Totale (m²)"
          value={data.total_surface ? data.total_surface.toString() : "N/A"}
          bold
        />
        <DataField
          label="Surface Développée (m²)"
          value={data.developed_surface ? data.developed_surface.toString() : "N/A"}
          bold
        />
        <DataField label="Nombre d'Etages" value={data.floor_number ? data.floor_number.toString() : "N/A"} bold />
        <DataField label="Nombre de Pièces" value={data.rooms_number ? data.rooms_number.toString() : "N/A"} bold />
        <DataField
          label="Nombre de Salles de Bain"
          value={data.bathrooms_number ? data.bathrooms_number.toString() : "N/A"}
          bold
        />
        <DataField
          label="Nombre de Chambres"
          value={data.bedrooms_number ? data.bedrooms_number.toString() : "N/A"}
          bold
        />
        <DataField label="Date de Disponibilité" value={data.availability_date} bold />
        <div className="space-y-2">
          <p className="text-xs text-zinc-400 uppercase font-semibold">Caractéristiques Additionnelles</p>
          <ul className="text-sm font-bold space-y-1">
            {data.characteristics?.map((f) => (
              <li key={f.id}>• {f.name[locale]}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Documents */}
        <div>
          <p className="text-xs text-zinc-400 uppercase font-semibold mb-3">Documents du Bien</p>
          {data.documents && data.documents.length > 0 ? (
            <Carousel className="w-full px-6">
              <CarouselContent>
                {data.documents.map((doc, index) => (
                  <CarouselItem key={index} className="basis-1/3">
                    <DocCard key={doc.id} doc={doc} onClick={() => downloadFile(doc)} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
            </Carousel>
          ) : (
            <p className="text-sm font-medium text-zinc-500">Aucun document</p>
          )}
        </div>

        {/* Commentaire */}
        <div className="space-y-2">
          <p className="text-xs text-zinc-400 uppercase font-semibold">Commentaire</p>
          <p className="text-sm font-bold leading-tight">{data.comment}</p>
        </div>
      </div>
    </div>
  );
}

async function downloadFile(doc: Media) {
  const blob = await getMediaAsBlobAction(doc);
  if (!blob) return;

  const binaryString = window.atob(blob.base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const file = new File([bytes], doc.name, { type: doc.mime_type });
  const url = URL.createObjectURL(file);

  const a = document.createElement("a");
  a.href = url;
  a.download = doc.name;
  a.click();

  URL.revokeObjectURL(url); // cleanup immediately after click
}

/** ─── REUSABLE UI COMPONENTS ─── **/

function DataField({ label, value, bold }: { label: string; value?: string | null | undefined; bold?: boolean }) {
  return (
    <div className="border-b text-xs border-zinc-200">
      <p className="text-zinc-400 uppercase font-semibold">{label}</p>
      <p className={bold ? "font-bold" : "font-medium"}>{value || "N/A"}</p>
    </div>
  );
}

const handlePrint = (bien: Bien, locale: "fr" | "en" | "ar") => {
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
        <title>Fiche Bien - ${bien.title}</title>
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
            }
            
            .page-break {
              page-break-after: always;
            }
          }
          
          /* Additional styling for print layout */
          .print-container {
            font-family: system-ui, -apple-system, sans-serif;
            background-color: #F5F2EB;
            padding: 30px;
          }
          
          .print-header {
            border-bottom: 2px solid #C5A267;
            padding-bottom: 16px;
            margin-bottom: 30px;
          }
          
          .print-title {
            font-size: 32px;
            font-weight: 600;
            color: #C5A267;
            font-family: serif;
            margin: 0;
          }
          
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            margin-bottom: 30px;
          }
          
          .print-column {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .print-field {
            border-bottom: 1px solid #e4e4e7;
            padding-bottom: 8px;
          }
          
          .print-label {
            font-size: 11px;
            color: #a1a1aa;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .print-value {
            font-size: 14px;
            font-weight: 500;
            color: #18181b;
          }
          
          .print-value-bold {
            font-weight: 700;
            color: #18181b;
          }
          
          .print-section-title {
            font-size: 11px;
            color: #a1a1aa;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
            margin-bottom: 12px;
            margin-top: 20px;
          }
          
          .print-description {
            font-size: 13px;
            line-height: 1.6;
            color: #3f3f46;
            font-weight: 500;
          }
          
          .print-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .print-list li {
            font-size: 13px;
            font-weight: 700;
            color: #18181b;
            margin-bottom: 4px;
          }
          
          .print-address {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 700;
          }
          
          .print-documents {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
          }
          
          .print-doc-item {
            font-size: 12px;
            color: #52525b;
            padding: 4px 8px;
            background-color: white;
            border: 1px solid #e4e4e7;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <!-- Page 1 -->
          <div>
            <div class="print-header">
              <h1 class="print-title">Fiche Bien</h1>
            </div>
            
            <div class="print-grid">
              <!-- Left Column -->
              <div class="print-column">
                <div class="print-field">
                  <div class="print-label">ID du bien</div>
                  <div class="print-value print-value-bold">${bien.id}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Type de bien</div>
                  <div class="print-value print-value-bold">${bien.type?.name[locale] || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Statut du bien</div>
                  <div class="print-value print-value-bold">${bien.status?.name[locale] || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Type de transaction</div>
                  <div class="print-value print-value-bold">${bien.transaction_type?.name[locale] || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Prix de vente</div>
                  <div class="print-value print-value-bold">${bien.price?.toLocaleString()} DA</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Charges mensuelles</div>
                  <div class="print-value print-value-bold">${bien.monthly_charges ? bien.monthly_charges.toLocaleString() + " DA" : "N/A"} </div>
                </div>
              </div>
              
              <!-- Right Column -->
              <div class="print-column">
                <div class="print-field">
                  <div class="print-label">Exclusivité</div>
                  <div class="print-value print-value-bold">${bien.exclusivity ? "Oui" : "Non"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Agent responsable</div>
                  <div class="print-value print-value-bold">${bien.agent?.first_name + " " + bien.agent?.last_name || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Wilaya</div>
                  <div class="print-value print-value-bold">${bien.wilaya?.name[locale] || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Commune</div>
                  <div class="print-value print-value-bold">${bien.commune?.name[locale] || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Code postale</div>
                  <div class="print-value print-value-bold">${bien.postal_code || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Adresse</div>
                  <div class="print-value print-value-bold">${bien.adresse || "N/A"}</div>
                </div>
                
                <div style="margin-top: 20px;">
                  <div class="print-label">Description</div>
                  <div class="print-description print-value-bold">${bien.description || "Aucune description"}</div>
                </div>
                
                <div class="print-field" style="margin-top: 20px;">
                  <div class="print-label">Date de Création</div>
                  <div class="print-value print-value-bold">${format(bien.created_at, "dd-MM-yyyy") || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Page 2 -->
          <div class="page-break"></div>
          <div>
            <div class="print-header">
              <h1 class="print-title">Fiche Bien (Suite)</h1>
            </div>
            
            <div class="print-grid">
              <!-- Left Column -->
              <div class="print-column">
                <div class="print-field">
                  <div class="print-label">Surface Habitable (m²)</div>
                  <div class="print-value print-value-bold">${bien.habitable_surface ? bien.habitable_surface : "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Surface Totale (m²)</div>
                  <div class="print-value print-value-bold">${bien.total_surface ? bien.total_surface : "N/A"} m²</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Surface Développée (m²)</div>
                  <div class="print-value print-value-bold">${bien.developed_surface || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Nombre d'Etages</div>
                  <div class="print-value print-value-bold">${bien.floor_number || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Nombre de Pièces</div>
                  <div class="print-value print-value-bold">${bien.rooms_number || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Nombre de Salles de Bain</div>
                  <div class="print-value print-value-bold">${bien.bathrooms_number || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Nombre de Chambres</div>
                  <div class="print-value print-value-bold">${bien.bedrooms_number || "N/A"}</div>
                </div>
                
                <div class="print-field">
                  <div class="print-label">Date de Disponibilité</div>
                  <div class="print-value print-value-bold">${bien.availability_date || "N/A"}</div>
                </div>
                
                <div style="margin-top: 20px;">
                  <div class="print-section-title">Caractéristiques Additionnelles</div>
                  <ul class="print-list">
                    ${
                      bien.characteristics && bien.characteristics.length > 0
                        ? bien.characteristics.map((f) => `<li>• ${f.name[locale]}</li>`).join("")
                        : "<li>Aucune caractéristique</li>"
                    }
                  </ul>
                </div>
              </div>
              
              <!-- Right Column -->
              <div class="print-column">
                <div class="print-field">
                  <div class="print-label">Priorité</div>
                  <div class="print-value print-value-bold">${"N/A"}</div>
                </div>
                
                <div style="margin-top: 20px;">
                  <div class="print-section-title">Documents du Bien</div>
                  <div class="print-documents">
                    ${
                      bien.documents && bien.documents.length > 0
                        ? bien.documents
                            .map((doc) => `<div class="print-doc-item">${doc.name || "Document"}</div>`)
                            .join("")
                        : '<div class="print-doc-item">Aucun document</div>'
                    }
                  </div>
                </div>
                
                <div style="margin-top: 30px;">
                  <div class="print-section-title">Commentaire</div>
                  <div class="print-description">${bien.comment || "Aucun commentaire"}</div>
                </div>
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

function DocCard({ doc, onClick }: { doc: Media; onClick: () => void }) {
  const isPdf = doc.mime_type === "application/pdf";
  const isWord =
    doc.mime_type === "application/msword" ||
    doc.mime_type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isImage = doc.mime_type.startsWith("image/");

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 w-20 group cursor-pointer">
      <div className="p-3 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center w-14 h-14 group-hover:border-[#C5A267] group-hover:shadow-md transition-all">
        {isPdf && (
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
        )}
        {isWord && (
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
        )}
        {isImage && <ImageIcon className="w-7 h-7 text-emerald-500" />}
        {!isPdf && !isWord && !isImage && <FileText className="w-7 h-7 text-zinc-400" />}
      </div>
      <span className="text-xs font-medium text-zinc-500 text-center leading-tight line-clamp-2 w-full group-hover:text-zinc-800 transition-colors">
        {doc.name}
      </span>
    </button>
  );
}
