"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import CustomButton from "@/components/ui/custom-button";
import { Bill } from "@/schemas/bills/bill.schema";
import { Payment } from "@/schemas/payment/payment.schema";
import { getPaymentHistoryAction } from "@/actions/payment/get-payment-history.action";

interface Props {
  bill: Bill;
}

export default function PaymentHistoryDialog({ bill }: Props) {
  const t = useTranslations();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    const response = await getPaymentHistoryAction(bill.id);
    if (response.isOk && response.data) {
      setPayments(response.data);
    }
    setIsLoading(false);
  };

  // Fetch data only when the dialog is opened
  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton Icon={History} size="icon" variant="ghost" className="!p-0" />
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>History - #{bill.id.toString().padStart(6, "0")}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 border rounded-md">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>comment</TableHead>
                <TableHead className="text-right">amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(payment.payment_date).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="font-medium">{payment.reference || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={payment.comment || ""}>
                      {payment.comment || "-"}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-600">
                      {new Intl.NumberFormat("fr-DZ", {
                        style: "decimal",
                        minimumFractionDigits: 2,
                      }).format(Number(payment.amount))}{" "}
                      Da
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
