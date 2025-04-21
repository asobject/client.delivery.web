

export enum OrderStatus {
  Created = 1,
  InTransit = 2,
  AtPoint = 3,
  Delivered = 4,
  Cancelled = 5
}
export function getOrderStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Created:
      return 'Создан';
    case OrderStatus.InTransit:
      return 'В пути';
    case OrderStatus.AtPoint:
      return 'В пункте';
    case OrderStatus.Delivered:
      return 'Доставлен';
    case OrderStatus.Cancelled:
      return 'Отменен';
    default:
      return 'Неизвестный статус';
  }
}
export function getOrderStatusSeverity(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Created:
      return 'success';
    case OrderStatus.InTransit:
      return 'secondary';
    case OrderStatus.AtPoint:
      return 'warn';
    case OrderStatus.Delivered:
      return 'success';
    case OrderStatus.Cancelled:
      return 'danger';
    default:
      return 'danger';
  }
}


export function getOrderStatusOptions(): { label: string; value: OrderStatus }[] {
  return [
    { label: getOrderStatusLabel(OrderStatus.Created), value: OrderStatus.Created },
    { label: getOrderStatusLabel(OrderStatus.InTransit), value: OrderStatus.InTransit },
    { label: getOrderStatusLabel(OrderStatus.AtPoint), value: OrderStatus.AtPoint },
    { label: getOrderStatusLabel(OrderStatus.Delivered), value: OrderStatus.Delivered },
    { label: getOrderStatusLabel(OrderStatus.Cancelled), value: OrderStatus.Cancelled }
  ];
}
