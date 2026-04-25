"use client";

import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import CustomButton from "@/components/ui/custom-button";
import { Eye, Printer } from "lucide-react";
import { Bill } from "@/schemas/bills/bill.schema";

interface Props {
  bill: Bill;
}

export default function ViewBillDialog({ bill }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    // Create a temporary hidden iframe or use a print-specific CSS approach
    // The simplest way for web apps is window.print() with CSS @media print
    window.print();
  };

  // Helper for formatting
  const formatCurrency = (val: number | string) => `${Number(val).toFixed(2)} DZD`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CustomButton Icon={Eye} size="icon" variant="ghost" className="!p-0" />
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2 print:hidden">
          <DialogTitle>Aperçu de la Facture</DialogTitle>
          <CustomButton Icon={Printer} onClick={handlePrint} className="mr-6" text="Imprimer" />
        </DialogHeader>

        {/* This div is what will be styled for printing */}
        <div ref={printRef} className="p-4 print:p-0">
          <Card className="bg-white shadow-none border-2 print:border-0">
            <CardContent className="p-8 space-y-6">
              {/* Header with Logo */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
                <div className="flex-1">
                  {bill?.billing_model?.logo ? (
                    <img src={"URL.bill.logo_url"} alt="Logo" className="max-h-20 max-w-[200px] object-contain" />
                  ) : (
                    <div className="h-20 w-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 print:border">
                      Logo
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-bold text-gray-800">FACTURE</h1>
                  <p className="text-sm text-gray-600 mt-1">N° {bill.id.toString().padStart(6, "0")}</p>
                </div>
              </div>

              {/* Billing Info */}
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Date de facture :</p>
                  <p className="text-gray-600">{new Date(bill.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Date d'échéance :</p>
                  <p className="text-gray-600">{new Date(bill.due_date).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>

              {/* Totals Table */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 print:bg-white print:border">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Total HT :</span>
                  <span className="font-medium">{formatCurrency(bill.amount_ht)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">TVA ({bill.billing_model?.tax_rate || 0}%) :</span>
                  <span className="font-medium">{formatCurrency(bill.amount_tva)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
                  <span>Total TTC :</span>
                  <span>{formatCurrency(bill.amount_ttc)}</span>
                </div>
              </div>

              {/* Bank Details */}
              <div className="border-t pt-4 space-y-3">
                <p className="font-semibold text-sm text-gray-800">Informations bancaires :</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Banque :</span> {bill.billing_model?.bank_name || "-"}
                  </p>
                  <p>
                    <span className="font-medium">IBAN :</span> {bill.billing_model?.iban || "-"}
                  </p>
                  <p>
                    <span className="font-medium">BIC :</span> {bill.billing_model?.swift_bic || "-"}
                  </p>
                </div>
              </div>

              {/* Footer */}
              {bill.billing_model?.footer && (
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-600 whitespace-pre-wrap">{bill.billing_model?.footer}</p>
                </div>
              )}

              {/* Legal Mentions */}
              {bill.billing_model?.legal_mentions && (
                <div className="border-t pt-4 bg-gray-50 -mx-8 -mb-8 px-8 py-4 rounded-b-lg print:bg-transparent">
                  <p className="text-xs text-gray-500 italic whitespace-pre-wrap">
                    {bill.billing_model?.legal_mentions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
