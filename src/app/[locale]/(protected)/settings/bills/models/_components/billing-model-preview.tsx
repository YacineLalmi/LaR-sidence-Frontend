// import { Card, CardContent } from "@/components/ui/card";
// import { BillingModelForm } from "@/schemas/bills/models/billing-model-form.schema";
// import { useMemo } from "react";

// interface Props {
//   billingModelForm: BillingModelForm;
// }
// export default function BillingModelPreview({ billingModelForm }: Props) {
//   // Calculate preview amounts
//   const previewHT = 1000;
//   const { taxRate, previewTVA, previewTTC } = useMemo(
//     (): {
//       taxRate: number;
//       previewTVA: number;
//       previewTTC: number;
//     } => ({
//       taxRate: parseFloat(billingModelForm.tax_rate) || 0,
//       previewTVA: (previewHT * taxRate) / 100,
//       previewTTC: previewHT + previewTVA,
//     }),
//     [billingModelForm],
//   );

//   return (
//     <Card className="bg-white shadow-lg border-2">
//       <CardContent className="p-8 space-y-6">
//         {/* Header avec Logo */}
//         <div className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
//           <div className="flex-1">
//             {logoPreview ? (
//               <img src={logoPreview} alt="Logo" className="max-h-20 max-w-[200px] object-contain" />
//             ) : (
//               <div className="h-20 w-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
//                 Votre logo
//               </div>
//             )}
//           </div>
//           <div className="text-right">
//             <h1 className="text-2xl font-bold text-gray-800">FACTURE</h1>
//             <p className="text-sm text-gray-600 mt-1">N° FAC-2025-0001</p>
//           </div>
//         </div>

//         {/* Informations de facturation */}
//         <div className="grid grid-cols-2 gap-6 text-sm">
//           <div>
//             <p className="font-semibold text-gray-800 mb-1">Date de facture :</p>
//             <p className="text-gray-600">22/04/2025</p>
//           </div>
//           <div>
//             <p className="font-semibold text-gray-800 mb-1">Date d'échéance :</p>
//             <p className="text-gray-600">22/05/2025</p>
//           </div>
//         </div>

//         {/* Tableau des montants */}
//         <div className="bg-gray-50 p-4 rounded-lg space-y-2">
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-700">Total HT :</span>
//             <span className="font-medium">{previewHT.toFixed(2)} DZD</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-700">TVA ({billingModelForm.tax_rate || "0"}%) :</span>
//             <span className="font-medium">{previewTVA.toFixed(2)} DZD</span>
//           </div>
//           <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
//             <span>Total TTC :</span>
//             <span>{previewTTC.toFixed(2)} DZD</span>
//           </div>
//         </div>

//         {/* Informations bancaires */}
//         <div className="border-t pt-4 space-y-3">
//           <p className="font-semibold text-sm text-gray-800">Informations bancaires :</p>
//           <div className="text-xs text-gray-600 space-y-1">
//             <p>
//               <span className="font-medium">Banque :</span> {billingModelForm.bank_name || "Nom de la banque"}
//             </p>
//             <p>
//               <span className="font-medium">IBAN :</span> {billingModelForm.iban || "FR76 XXXX XXXX XXXX XXXX XXXX XXX"}
//             </p>
//             <p>
//               <span className="font-medium">BIC :</span> {billingModelForm.swift_bic || "BNPAFRPPXXX"}
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         {billingModelForm.footer && (
//           <div className="border-t pt-4">
//             <p className="text-xs text-gray-600 whitespace-pre-wrap">{billingModelForm.footer}</p>
//           </div>
//         )}

//         {/* Mentions légales */}
//         {billingModelForm.legal_mentions && (
//           <div className="border-t pt-4 bg-gray-50 -mx-8 -mb-8 px-8 py-4 rounded-b-lg">
//             <p className="text-xs text-gray-500 italic whitespace-pre-wrap">{billingModelForm.legal_mentions}</p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
