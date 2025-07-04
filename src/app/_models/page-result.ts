
export class PageResult<T> {
  data: T[];
  totalRecords: number;

  constructor() {
    this.data = [];
    this.totalRecords = 0;
  }
}
