import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ClientService } from "../../../services/client.service";
import { Client } from "../../../models/client";
import { Router } from "@angular/router";
import { Doc } from "../../../models/doc";
import { FormPrintComponent } from "../../form/form-print/form-print.component";
import { isNullOrUndefined } from "util";
import { FormService } from "app/services/form.service";
import { DocService } from "app/services/doc.service";
import { Common } from "app/common";

declare let $;
declare let App;

@Component({
  selector: "app-client-finish",
  templateUrl: "./client-finish.component.html",
  styleUrls: [
    "./client-finish.component.css",
    "../../../../assets/pages/css/blog.min.css",
    "../../../../assets/pages/css/profile-2.min.css"
  ],
  providers: [ClientService, FormService, DocService]
})
export class ClientFinishComponent implements OnInit {
  private client = null;
  private forms = [];
  private completed_docs = [];
  private not_completed_docs = [];
  private add_ids = [];
  private delete_ids = [];
  private client_id: number;
  private form_id: number;
  private print_index: number;
  private detailLink;

  constructor(
    private _router: Router,
    private _clientService: ClientService,
    private _formService: FormService,
    private _docService: DocService,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.client_id = parseInt(this._router.url.split("/")[4]);
    this.getClient();
    this.getForms();
  }

  getClient() {
    this._clientService.getClient(this.client_id).subscribe(data => {
      this.client = data;
    });
  }

  getForms() {
    Common.showLoading();

    this._formService.getFormsWithoutTemplate().subscribe(
      data => {
        Common.hideLoading();
        //console.log("forms", data);
        //console.log("forms", data.data);

        this.forms = data.data;
        this.getDocs();
      },
      error => {
        Common.hideLoading();
      }
    );
  }

  getDocs() {
    Common.showLoading();

    this._clientService.getDocsByClientId(this.client_id).subscribe(
      data => {
        Common.hideLoading();
        //console.log("completed_docs", data.docs.data);

        this.completed_docs = data.docs.data;
        let not_completed_docs = [];
        for (let i = 0; i < this.forms.length; i++) {
          let form = this.forms[i];
          let flag = true;
          for (let j = 0; j < this.completed_docs.length; j++) {
            let doc = this.completed_docs[j];
            if (doc.form_id == form.id) {
              flag = false;
              break;
            }
          }
          if (flag) {
            not_completed_docs.push({
              form_id: form.id,
              client_id: this.client_id,
              form_name: form.name,
              form_type: form.type,
              checked: false
            });
          }
        }
        //console.log("not_completed_docs", not_completed_docs);
        this.not_completed_docs = not_completed_docs;

        $("#completedAllCheckbox")[0].checked = false;
        $("#notCompletedAllCheckbox")[0].checked = false;
        $("#addDocsButton, #deleteDocsButton, #savePDFButton").addClass(
          "disabled"
        );
        this.add_ids = [];
        this.delete_ids = [];

        this._cd.detectChanges();
      },
      error => {
        Common.hideLoading();
      }
    );
  }

  detail() {
    localStorage.setItem("form_wizard", "1");
    this._router.navigate(["/pages/client/detail/" + this.client_id + "/0"]);
  }

  printForm(id) {
    FormPrintComponent.instance.form_id = id;
    FormPrintComponent.instance.client_id = this.client_id;
    FormPrintComponent.instance.getForm();
  }

  printForms(index) {
    if ($("#savePDFButton").hasClass("disabled")) return;

    let completed_docs = this.getCheckedDocs();
    let completed_doc = completed_docs[index];
    if (!isNullOrUndefined(completed_doc)) {
      this.printForm(completed_doc.form_id);
      this.print_index = index;
    }
  }

  printed() {
    this.printForms(this.print_index + 1);
  }

  getCheckedDocs(type = "completed") {
    let data = [];
    let selected_ids = [];
    if (type == "completed") {
      for (let i in this.completed_docs) {
        let doc = this.completed_docs[i];
        if (doc.checked) {
          data.push(doc);
          selected_ids.push(doc.form_id);
        }
      }
      this.delete_ids = selected_ids;
    } else {
      for (let i in this.not_completed_docs) {
        let doc = this.not_completed_docs[i];
        if (doc.checked) {
          data.push(doc);
          selected_ids.push(doc.form_id);
        }
      }
      this.add_ids = selected_ids;
    }

    return data;
  }

  checkChanged(flag = "", type = "completed") {
    let checked_docs = this.getCheckedDocs(type);
    if (checked_docs.length > 0) {
      if (type == "completed") {
        $("#savePDFButton, #deleteDocsButton").removeClass("disabled");
      } else {
        $("#addDocsButton").removeClass("disabled");
      }
    } else {
      if (type == "completed") {
        $("#savePDFButton, #deleteDocsButton").addClass("disabled");
      } else {
        $("#addDocsButton").addClass("disabled");
      }
    }

    if (flag == "all") return;

    if (type == "completed") {
      $("#completedAllCheckbox")[0].checked =
        checked_docs.length == this.completed_docs.length;
    } else {
      $("#notCompletedAllCheckbox")[0].checked =
        checked_docs.length == this.not_completed_docs.length;
    }
  }

  checkAllChanged(type = "completed") {
    if (type == "completed") {
      for (let i in this.completed_docs) {
        this.completed_docs[i].checked = $("#completedAllCheckbox")[0].checked;
      }
    } else {
      for (let i in this.not_completed_docs) {
        this.not_completed_docs[i].checked = $(
          "#notCompletedAllCheckbox"
        )[0].checked;
      }
    }
    this.checkChanged("all", type);
  }

  approveChanged() {
    this.getDocs();
  }

  addDocs() {
    if ($("#addDocsButton").hasClass("disabled")) {
      return;
    }

    console.log("Add docs", this.add_ids);
    this._docService
      .selectDocs(this.client_id, this.add_ids)
      .subscribe(data => {
        this.getDocs();
      });
  }

  deleteDocs() {
    if ($("#deleteDocsButton").hasClass("disabled")) {
      return;
    }

    if (confirm("Are you sure to delete the selected forms?")) {
      console.log("Delete docs", this.delete_ids);
      this._docService
        .deleteDocs(this.client_id, this.delete_ids)
        .subscribe(data => {
          this.getDocs();
        });
    }
  }
}
