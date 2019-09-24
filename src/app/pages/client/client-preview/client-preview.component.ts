import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormService } from "../../../services/form.service";
import { ClientService } from "../../../services/client.service";
import { FormHelper } from "../../form/form-helper";
import { DocService } from "../../../services/doc.service";
import { PrintService } from "../../../services/print.service";
import { isNullOrUndefined } from "util";
import { Common } from "../../../common";
import { Notification } from "../../../common_modules/notification";
import { FormPrintComponent } from "../../form/form-print/form-print.component";

declare let $;
declare let App;

@Component({
  selector: "app-client-preview",
  templateUrl: "./client-preview.component.html",
  styleUrls: ["./client-preview.component.css"],
  providers: [FormService, DocService, PrintService, ClientService]
})
export class ClientPreviewComponent implements OnInit {
  private client_id;
  private form_id;
  private form_type;
  private template;
  private client = null;

  constructor(
    private _router: Router,
    private _formService: FormService,
    private _docService: DocService,
    private _printService: PrintService,
    private _clientService: ClientService
  ) {}

  ngOnInit() {
    this.client_id = parseInt(this._router.url.split("/")[4]);
    this.form_id = parseInt(this._router.url.split("/")[5]);
    this.getClient();
    this.getForm();
  }

  getClient() {
    this._clientService.getClient(this.client_id).subscribe(data => {
      console.log("client", data);
      this.client = data;
    });
  }

  getForm() {
    if (isNullOrUndefined(this.client_id) || isNullOrUndefined(this.form_id)) {
      return;
    }
    Common.showLoading();

    this._formService.getForm(this.form_id).subscribe(
      data => {
        Common.hideLoading();
        this.form_type = data.type || "";
        $("#printInfo").html(this.form_type);
        this.template = JSON.parse(data.template);
        $("#formPreviewContainer").html("");
        this.template.pages.forEach(function(page) {
          let page_container = $('<div class="doc-page-container"></div>');
          FormHelper.buildHtml(page_container, page, "print");
          $("#formPreviewContainer").append(page_container);
          $("#formPreviewContainer").append('<div class="page-break"></div>');
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
        for (let i in this.template.pages) {
          let index = Number(i) + 1;
          let schema = FormHelper.getSchema(this.template, i);
          let inputs = FormHelper.buildInputs(schema, data);
          FormHelper.setLocalDoc(this.client_id, this.form_id, index, inputs);
          let page = this.template.pages[i];
          FormHelper.seedPage(
            page,
            this.client_id,
            this.form_id,
            index,
            "print"
          );
        }

        if (this.form_id === 1) {
          var photo_data = data["clients.photo"];
          $("#clientPhotoImage").attr("src", photo_data);
          localStorage.setItem("photo_data", photo_data);
          $("#clientPhotoInput").hide();
        }
        this.updatePreviewCSS();
      },
      error => {
        Common.hideLoading();
      }
    );
  }

  preparePrintCSS() {
    $("#formPreviewContainer .form-print-checkbox img").css("margin-top", 2);
  }

  updatePreviewCSS() {
    $("#formPreviewContainer .form-print-checkbox img").css("margin-top", -10);
  }

  showList() {
    this._router.navigate(["/pages/client/finish/" + this.client_id]);
  }

  print() {
    /*Common.showLoading();
    this.preparePrintCSS();
    let div = $("#formPreviewContainer");
    let html = div[0].outerHTML;
    let doc_name = "docs/doc_" + this.form_type + "_" + this.client_id + ".pdf";
    let host = window.location.host;

    this._printService.print(html, doc_name, host).subscribe(
      data => {
        Notification.notifyAny({ message: doc_name + " has been saved." });
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

    this.updatePreviewCSS();*/
    FormPrintComponent.instance.getForm();
  }
}
