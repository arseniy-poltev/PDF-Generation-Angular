import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Form } from "../../../models/form";
import "../../../../assets/plugins/jqwidgets/jqxbuttons.js";
import "../../../../assets/plugins/jqwidgets/jqxscrollbar.js";
import "../../../../assets/plugins/jqwidgets/jqxlistbox.js";
import "../../../../assets/plugins/jqwidgets/jqxdropdownlist.js";
import { FormService } from "../../../services/form.service";
import { ClientService } from "../../../services/client.service";
import { FormDocComponent } from "../../form/form-doc/form-doc.component";
import { PaginatorComponent } from "../shared/paginator/paginator.component";
import { FormPrintComponent } from "../../form/form-print/form-print.component";

declare let $: any;

@Component({
  selector: "app-client-detail",
  templateUrl: "./client-detail.component.html",
  styleUrls: ["./client-detail.component.css"],
  providers: [FormService, ClientService]
})
export class ClientDetailComponent implements OnInit {
  static instance;
  private currentPage: number;
  private form: Form;
  private client_id: number;
  private form_id: number;
  private form_wizard: boolean = true;
  private client = null;

  constructor(
    private _router: Router,
    private _formService: FormService,
    private _clientService: ClientService
  ) {
    ClientDetailComponent.instance = this;
  }

  ngOnInit() {
    let array = this._router.url.split("/");
    this.client_id = parseInt(array[array.length - 2]);
    this.form_id = parseInt(array[array.length - 1]);

    this.getClient();
    this.getForm();
  }

  getForm() {
    this._formService.getForm(this.form_id).subscribe(data => {
      this.form = data;
      this.form_wizard =
        localStorage.getItem("form_wizard") == "1" ? true : false;

      this.currentPage = 1;
      FormDocComponent.instance.form_id = this.form_id;
      if (this.form_wizard) {
        $(".doc-page-controls").hide();
      } else {
        $(".doc-page-controls").show();
      }
      PaginatorComponent.instance.setPageCount(this.form.page_count);
    });
  }

  getClient() {
    this._clientService.getClient(this.client_id).subscribe(data => {
      //console.log("client", data);
      this.client = data;
    });
  }

  pageSelected(event) {
    // $('#docContainer')[0].scrollTop = 0;
    $("html, body").animate(
      {
        scrollTop: 100
      },
      "fast"
    );
    FormDocComponent.instance.extractInputs();
    this.currentPage = event;
  }

  submitDoc() {
    FormDocComponent.instance.client_id = this.client_id;
    FormDocComponent.instance.submitDoc();
  }

  print() {
    FormPrintComponent.instance.getForm();
  }

  showList() {
    this._router.navigate(["/pages/client/finish/" + this.client_id]);
  }
}
