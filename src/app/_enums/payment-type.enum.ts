
export enum PaymentType {
  Customer = 1,
  Receiver = 2
}

export function getPaymentTypeLabel(type: PaymentType): string {
  switch(type) {
    case PaymentType.Customer:
      return 'Заказчик';
    case PaymentType.Receiver:
      return 'Получатель';
    default:
      return 'Неизвестный тип';
  }
}

export function getPaymentTypeOptions(): { label: string; value: number }[] {
  return [
    { label: getPaymentTypeLabel(PaymentType.Customer), value: PaymentType.Customer },
    { label: getPaymentTypeLabel(PaymentType.Receiver), value: PaymentType.Receiver }
  ];
}
