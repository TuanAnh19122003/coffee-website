export class CreatePaymentDto {
    paymentMethod: string;
    transactionId: string;
    paymentStatus: number;
    orderId: number;
    paidAmount: number;
}
