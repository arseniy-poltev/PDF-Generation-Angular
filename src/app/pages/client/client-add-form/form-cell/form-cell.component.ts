import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormWidget } from "../form-widget/form-widget";

@Component({
  selector: "app-form-cell",
  templateUrl: "./form-cell.component.html",
  styleUrls: ["./form-cell.component.css"]
})
export class FormCellComponent implements OnInit {
  @Input() form: FormWidget;
  @Output() onCheckChanged: EventEmitter<any>;

  constructor() {
    this.onCheckChanged = new EventEmitter();
  }

  ngOnInit() {}

  checkForm() {
    if (this.form.id == 1) return;
    this.form.checked = !this.form.checked;
    this.onCheckChanged.emit();
  }
}
