export enum PointType {
  Pudo = 1,
  Office = 2,
  Postamat = 3,
  Warehouse = 4
}
export function getPointTypeLabel(type: PointType): string {
  switch (type) {
    case PointType.Pudo:
      return 'ПВЗ';
    case PointType.Office:
      return 'Офис';
    case PointType.Postamat:
      return 'Постамат';
    case PointType.Warehouse:
      return 'Склад';
    default:
      return 'Неизвестный тип';
  }
}

export function getPointTypeOptions(): { label: string; value: PointType }[] {
  return [
    { label: getPointTypeLabel(PointType.Pudo), value: PointType.Pudo },
    { label: getPointTypeLabel(PointType.Office), value: PointType.Office },
    { label: getPointTypeLabel(PointType.Postamat), value: PointType.Postamat },
    { label: getPointTypeLabel(PointType.Warehouse), value: PointType.Warehouse }
  ];
}
