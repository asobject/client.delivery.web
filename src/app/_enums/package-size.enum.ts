
export enum PackageSize {
  Small = 1,
  Medium = 2,
  Large = 3
}

export function getPackageSizeLabel(size: PackageSize): string {
  switch (size) {
    case PackageSize.Small:
      return 'Маленькая';
    case PackageSize.Medium:
      return 'Средняя';
    case PackageSize.Large:
      return 'Большая';
    default:
      return 'Неизвестный размер';
  }
}

export function getPackageSizeOptions(): { label: string; value: PackageSize }[] {
  return [
    { label: getPackageSizeLabel(PackageSize.Small), value: PackageSize.Small },
    { label: getPackageSizeLabel(PackageSize.Medium), value: PackageSize.Medium },
    { label: getPackageSizeLabel(PackageSize.Large), value: PackageSize.Large }
  ];
}
