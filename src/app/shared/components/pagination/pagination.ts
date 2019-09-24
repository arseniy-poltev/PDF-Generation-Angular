export class Pagination {
  constructor(total = 0, index = 1) {
    this.total_pages = total;
    this.current_page = index;
  }
  current_page: number;
  total_pages: number;
}
