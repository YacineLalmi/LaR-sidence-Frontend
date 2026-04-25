"use server";

import { FormState } from "@/lib/definitions";
import { Payment } from "@/schemas/payment/payment.schema";
import { PaymentService } from "@/services/payment.service";

export async function getPaymentHistoryAction(billId: string | number): Promise<FormState<Payment[]>> {
    try {
        const history = await PaymentService.getHistory(billId);
        return {
            isOk: true,
            data: history, // This assumes PaymentService.getHistory returns Payment[]
        };
    } catch (error) {
        console.error("Fetch History Error:", error);
        return {
            isOk: false,
            errorMessage: "Could not retrieve payment history",
        };
    }
}