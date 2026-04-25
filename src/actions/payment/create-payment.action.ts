"use server";

import { FormState } from "@/lib/definitions";
import { PaymentForm } from "@/schemas/payment/payment-form.schema";
import { Payment } from "@/schemas/payment/payment.schema";
import { PaymentService } from "@/services/payment.service";

export async function createPaymentAction(billId: string, data: PaymentForm): Promise<FormState<Payment>> {
    try {
        const createdPayment = await PaymentService.create(billId, data);
        return {
            isOk: true,
            data: createdPayment
        }
    } catch (error) {
        console.error(error);
        return {
            isOk: false
        };
    }
}
