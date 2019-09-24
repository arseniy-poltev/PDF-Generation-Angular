import { Component, OnInit } from "@angular/core";
import { Client } from "../../../models/client";
import { Router } from "@angular/router";
import { FormDocComponent } from "../../form/form-doc/form-doc.component";
import { PaginatorComponent } from "../shared/paginator/paginator.component";

declare let $;

@Component({
  selector: "app-client-create",
  templateUrl: "./client-create.component.html",
  styleUrls: ["./client-create.component.css"]
})
export class ClientCreateComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit() {
    localStorage.setItem("form_wizard", "1");
    FormDocComponent.instance.form_id = 0;

    $(document).ready(function() {
      setTimeout(function() {
        $("#createButtonContainer").fadeIn();
      }, 1000);
    });
  }

  submitDoc() {
    FormDocComponent.instance.submitDoc();
  }
}
