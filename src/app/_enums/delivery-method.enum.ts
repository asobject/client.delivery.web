
export enum DeliveryMethod {
  PickupPoint = 1,
  CourierCall = 2
}

export function getDeliveryMethodLabel(method: DeliveryMethod): string {
  switch(method) {
    case DeliveryMethod.PickupPoint:
      return 'Пункт выдачи';
    case DeliveryMethod.CourierCall:
      return 'Курьерская доставка';
    default:
      return 'Неизвестный метод';
  }
}

export function getDeliveryMethodOptions(): { label: string; value: number }[] {
  return [
    { label: getDeliveryMethodLabel(DeliveryMethod.PickupPoint), value: DeliveryMethod.PickupPoint },
    { label: getDeliveryMethodLabel(DeliveryMethod.CourierCall), value: DeliveryMethod.CourierCall }
  ];
}
