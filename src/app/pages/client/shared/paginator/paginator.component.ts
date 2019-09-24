import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

declare let $;

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  static instance: PaginatorComponent;
  public pageCount: number;
  @Output() onPageSelected: EventEmitter<number>;
  currentPage: number = 1;

  constructor() {
    PaginatorComponent.instance = this;
    this.onPageSelected = new EventEmitter();
  }

  ngOnInit() {
  }

  onPageChanged() {
    let text = $('#pageInput').html();
    let array = text.split('/');
    let page = parseInt(array[0]);
    this.goto(page);
    $('#pageInput').html(this.currentPage + ' / ' + this.pageCount);
  }

  keydown(event) {
    if (event.keyCode == 13) {
      event.preventDefault();

      PaginatorComponent.instance.onPageChanged();
    }
  }

  goto(page) {
    if (page == this.currentPage || page < 1 || page > this.pageCount) {
      return;
    }
    this.currentPage = page;
    this.onPageSelected.emit(this.currentPage);
    $('#pageInput').html(this.currentPage + ' / ' + this.pageCount);
  }

  setPageCount(count) {
    this.pageCount = count;
    $('#pageInput').html(this.currentPage + ' / ' + this.pageCount);
  }
}
