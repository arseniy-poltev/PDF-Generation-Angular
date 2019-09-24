import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Doc} from "../../../../models/doc";
import {Form} from "../../../../models/form";
import {FormService} from "../../../../services/form.service";
import {Router} from "@angular/router";
import { Common } from '../../../../common';
import { DocService } from '../../../../services/doc.service';

declare let App;
declare let $;

@Component({
  selector: 'app-finish-form-widget',
  templateUrl: './finish-form-widget.component.html',
  styleUrls: ['./finish-form-widget.component.css'],
  providers: [DocService]
})
export class FinishFormWidgetComponent implements OnInit {
  @Input() docs;
  @Input() client_id: number;
  @Output() onCheckChanged: EventEmitter<any>;
  @Output() onApproveChanged: EventEmitter<any>;
  @Input() type = "completed";
  public role;

  constructor(private _router: Router, private _docService: DocService) {
    this.onCheckChanged = new EventEmitter();
    this.onApproveChanged = new EventEmitter();
  }

  ngOnInit() {
    this.role = Common.getUser().role;
  }

  checkForm(doc) {
    doc.checked = !doc.checked;
    this.onCheckChanged.emit();
  }

  detail(form_id) {
    localStorage.setItem('form_wizard', "0");
    this._router.navigate(['/pages/client/detail/' + this.client_id + '/' + form_id]);
  }

  preview(form_id) {
    this._router.navigate(['/pages/client/preview/' + this.client_id + '/' + form_id]);
  }

  approve(doc_id) {
    console.log('approve', doc_id);
    this.approveDismiss(doc_id, true);
  }

  dismiss(doc_id) {
    console.log('dismiss', doc_id);
    this.approveDismiss(doc_id, false);
  }

  approveDismiss(doc_id, approve) {
    Common.showLoading();

    this._docService.approveDismissDoc(doc_id, approve)
      .subscribe(data => {
        Common.hideLoading();

        this.onApproveChanged.emit();
      })
  }
}
