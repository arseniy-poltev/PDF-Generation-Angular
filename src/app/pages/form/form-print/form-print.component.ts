import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { FormService } from "../../../services/form.service";
import { FormHelper } from "../form-helper";
import { isNullOrUndefined } from "util";
import { DocService } from "../../../services/doc.service";
import { PrintService } from "../../../services/print.service";
import { Common } from "../../../common";
import { Notification } from "../../../common_modules/notification";

declare let $;
declare let App;

@Component({
  selector: "app-form-print",
  templateUrl: "./form-print.component.html",
  styleUrls: ["./form-print.component.css"],
  providers: [FormService, DocService, PrintService]
})
export class FormPrintComponent implements OnInit {
  static instance: FormPrintComponent;
  @Input() client_id: number;
  @Input() form_id: number;
  private template;
  private form_type: string;
  @Output() onPrinted: EventEmitter<any>;

  constructor(
    private _router: Router,
    private _formService: FormService,
    private _docService: DocService,
    private _printService: PrintService
  ) {
    FormPrintComponent.instance = this;
    this.onPrinted = new EventEmitter();
  }

  ngOnInit() {
    // let url = this._router.url;
    // let array = url.split('/');
    // this.client_id = Number(array[array.length - 2]) || null;
    // this.form_id = Number(array[array.length - 1]) || null;
    // this.getForm();
  }

  ngAfterViewInit() {}

  getForm() {
    if (isNullOrUndefined(this.client_id) || isNullOrUndefined(this.form_id)) {
      return;
    }
    Common.showLoading();

    this._formService.getForm(this.form_id).subscribe(
      data => {
        this.form_type = data.type || "";
        $("#printInfo").html(this.form_type);
        this.template = JSON.parse(data.template);
        $("#formContainer").html("");
        this.template.pages.forEach(function(page) {
          let page_container = $('<div class="doc-page-container"></div>');
          FormHelper.buildHtml(page_container, page, "print");
          $("#formContainer").append(page_container);
          $("#formContainer").append('<div class="page-break"></div>');
        });

        this.getDoc();
      },
      error => {
        Common.hideLoading();
      }
    );
  }

  getDoc() {
    this._docService.getDocByClientForm(this.client_id, this.form_id).subscribe(
      data => {
        let pdfKeyValues = {};
        for (let i in this.template.pages) {
          let index = Number(i) + 1;
          let schema = FormHelper.getSchema(this.template, i);
          let inputs = FormHelper.buildPDFKeyValue(schema, data);
          for (let key in inputs) {
            pdfKeyValues[key] = inputs[key];
          }

          /*FormHelper.setLocalDoc(this.client_id, this.form_id, index, inputs);
          let page = this.template.pages[i];
          FormHelper.seedPage(
            page,
            this.client_id,
            this.form_id,
            index,
            "print"
          );*/
        }

        /*nned to bo fixed for photo
        if (this.form_id === 1) {
          var photo_data = data["clients.photo"];
          $("#clientPhotoImage").attr("src", photo_data);
          localStorage.setItem("photo_data", photo_data);
          $("#clientPhotoInput").hide();
        }*/
        //console.log(pdfKeyValues);

        this.print(pdfKeyValues);
      },
      error => {
        Common.hideLoading();
      }
    );
  }

  print(pdfKeyValues) {
    let div = $("#formContainer");
    let html = div[0].outerHTML;

    let doc_name = "docs/doc_" + this.form_type + "_" + this.client_id + ".pdf";
    let host = window.location.host;

    this._printService
      .print(pdfKeyValues, this.form_type, doc_name, host)
      .subscribe(
        data => {
          console.log(data);
          Notification.notifyAny({ message: doc_name + " has been saved." });
          this.onPrinted.emit();
          let url =
            Common.BASE_URL +
            "/api/downloadDoc?doc_name=" +
            doc_name +
            "&token=" +
            Common.getUser().token;
          window.open(url, "_self");

          Common.hideLoading();
        },
        error => {
          Common.hideLoading();
        }
      );
  }
}
