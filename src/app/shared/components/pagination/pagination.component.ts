import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Pagination} from "./pagination";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() pagination: Pagination;
  @Output() onPageSelected: EventEmitter<Pagination>;
  private pages: number[];

  constructor() {
    this.onPageSelected = new EventEmitter();
    this.pages = [];
  }

  ngOnInit() {
  }

  ngDoCheck() {
    if(this.pages.length != this.pagination.total_pages) {
      this.refreshUI();
    }
  }

  refreshUI() {
    this.pages = [];
    for (let i = 0; i < this.pagination.total_pages; i++) {
      this.pages.push(i + 1);
    }

    this.onPageSelected.emit(this.pagination);
  }

  goto(page) {
    if(page == this.pagination.current_page || page < 1 || page > this.pagination.total_pages) {
      return;
    }
    this.pagination.current_page = page;
    this.onPageSelected.emit(this.pagination);
  }
}
