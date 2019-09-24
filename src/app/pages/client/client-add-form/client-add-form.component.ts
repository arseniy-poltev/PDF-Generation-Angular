import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ClientService} from "../../../services/client.service";
import {DocService} from "../../../services/doc.service";
import {FormService} from "../../../services/form.service";
import {Doc} from "../../../models/doc";
import {Router} from "@angular/router";
import {isNullOrUndefined} from "util";
import {FormWidget} from "./form-widget/form-widget"
import {Common} from "../../../common";

declare let $;
declare let App;

@Component({
  selector: 'app-client-add-form',
  templateUrl: './client-add-form.component.html',
  styleUrls: [
    './client-add-form.component.css',
    '../../../../assets/pages/css/blog.min.css'],
  providers: [
    ClientService,
    DocService,
    FormService,
  ]
})
export class ClientAddFormComponent implements OnInit {
  static instance: ClientAddFormComponent;
  private client_id: number;
  @Output() onChanged: EventEmitter<any>;
  private docs: Doc[];
  private docs$: EventEmitter<any> = new EventEmitter();
  private unselected_forms: FormWidget[];
  private selected_forms: FormWidget[];
  private deleted_ids;
  private added_ids;
  private client;

  constructor(private _clientService: ClientService,
              private  _docService: DocService,
              private _formService: FormService,
              private _router: Router) {
    ClientAddFormComponent.instance = this;
    this.onChanged = new EventEmitter();
    this.deleted_ids = [];
    this.added_ids = [];
  }

  ngOnInit() {
    let array = this._router.url.split('/');
    this.client_id = parseInt(array[array.length - 1]);
    this.getClient();
    this.getDocsByClientId();
  }

  getClient() {
    this._clientService.getClient(this.client_id)
      .subscribe(data => {
        console.log('client', data);
        this.client = data;
      });
  }

  checkAllSelectChanged() {
    let checked = $('#allSelectCheckbox')[0].checked;
    this.selected_forms.forEach(function (item) {
      if (item.id == 1) return;
      item.checked = checked;
    });
    this.checkChanged();
  }

  checkAllAddChanged() {
    let checked = $('#allAddCheckbox')[0].checked;
    this.unselected_forms.forEach(function (item) {
      if (item.id == 1) return;
      item.checked = checked;
    });
    this.checkChanged();
  }

  getDocsByClientId() {
    Common.showLoading();

    this._clientService.getDocsByClientId(this.client_id)
      .subscribe(data => {
        this.docs = data.docs.data || [];
        this.getForms();
      }, error => {
        Common.hideLoading();
      });
  }

  getForms() {
    this._formService.getFormsWithoutTemplate()
      .subscribe(data => {
        let temps = data.data;
        this.getFormWidgets(temps);

        Common.hideLoading();
      }, error => {
        Common.hideLoading();
      });
  }

  getFormWidgets(temps) {
    this.unselected_forms = [];
    this.selected_forms = [];
    for (let i in temps) {
      let form: FormWidget = new FormWidget();
      let checked: boolean = false;
      for (let j in this.docs) {
        if (this.docs[j].form_id == temps[i].id) {
          checked = true;
        }
      }
      form.id = temps[i].id;
      form.checked = false;
      form.type = temps[i].type;
      form.name = temps[i].name;
      form.description = temps[i].description;
      if (checked) {
        this.selected_forms.push(form);
      } else {
        this.unselected_forms.push(form);
      }
    }
    $('#allSelectCheckbox')[0].checked = false;
    $('#allAddCheckbox')[0].checked = false;
    $('#deleteDocsButton').addClass('disabled');
    $('#addDocsButton').addClass('disabled');

    this.docs$.emit(this.docs);
  }

  deleteDocs() {
    if ($('#deleteDocsButton').hasClass('disabled')) return;

    if (confirm('Are you sure to delete the selected forms?')) {
      this._docService.deleteDocs(this.client_id, this.deleted_ids)
        .subscribe(data => {
          this.getDocsByClientId();
        });
    }
  }

  addDocs() {
    if ($('#addDocsButton').hasClass('disabled')) return;
    this._docService.selectDocs(this.client_id, this.added_ids)
      .subscribe(data => {
        this.getDocsByClientId();
      });
  }

  checkChanged() {
    this.deleted_ids = [];
    this.added_ids = [];
    let all_select_checked = true;
    for (let i in this.selected_forms) {
      let form = this.selected_forms[i];
      if (form.id == 1) continue;
      if (form.checked) {
        this.deleted_ids.push(form.id);
      } else {
        all_select_checked = false;
      }
    }
    let all_add_checked = true;
    for (let i in this.unselected_forms) {
      let form = this.unselected_forms[i];
      if (form.id == 1) continue;
      if (form.checked) {
        this.added_ids.push(form.id);
      } else {
        all_add_checked = false;
      }
    }

    $('#allSelectCheckbox')[0].checked = all_select_checked;
    $('#allAddCheckbox')[0].checked = all_add_checked;
    if (this.deleted_ids.length > 0) {
      $('#deleteDocsButton').removeClass('disabled');
    } else {
      $('#deleteDocsButton').addClass('disabled');
    }
    if (this.added_ids.length > 0) {
      $('#addDocsButton').removeClass('disabled');
    } else {
      $('#addDocsButton').addClass('disabled');
    }
  }
}
