import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {DropdownlistItem} from "./dropdownlist.item";

declare var $: any;

@Component({
  selector: 'app-dropdownlist',
  templateUrl: './dropdownlist.component.html',
  styleUrls: ['./dropdownlist.component.css']
})
export class DropdownlistComponent implements OnInit {
  @Input() items: DropdownlistItem[];
  @Input() value: DropdownlistItem;
  @Output() onSelected: EventEmitter<DropdownlistItem>;

  constructor() {
    this.onSelected = new EventEmitter();
  }

  ngOnInit() {
    $('.bs-select').selectpicker({
      iconBase: 'fa',
      tickIcon: 'fa-check'
    });
  }

  selectItem(event) {
    this.value = event.target.selectedOptions[0].value;
    console.log("selected ", this.value);
    this.onSelected.emit(this.value);
  }
}
