import { PaymentForm } from "@/schemas/payment/payment-form.schema";
import ApiService from "./api.service";
import { Payment, PaymentSchema } from "@/schemas/payment/payment.schema";
import { validateResponseData } from "@/lib/utils";
import z from "zod";

const END_POINTS = {
  base: (billId: string | number) => `/bills/${billId}/payments`,
};

export const PaymentService = {
  /**
   * Get payment history for a specific bill
   */
  getHistory: async (billId: string | number) => {
    const response = await ApiService.get<Payment[]>({
      endpoint: END_POINTS.base(billId),
    });


    const validateResponse = validateResponseData<Payment[]>(response.data, z.array(PaymentSchema))

    return validateResponse
  },

  /**
   * Create a new payment record
   */
  create: async (
    billId: string | number,
    data: PaymentForm
  ): Promise<Payment> => {
    const response = await ApiService.post<Payment>({
      endpoint: END_POINTS.base(billId),
      body: data,
    });

    const validateResponse = validateResponseData<Payment>(response.data, PaymentSchema)

    return validateResponse
  },
};