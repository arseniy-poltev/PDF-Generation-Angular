import { Component, OnInit } from "@angular/core";
import { Lawfirm } from "../../../models/lawfirm";
import { LawfirmService } from "app/services/lawfirm.service";
import { ProfileService } from "app/services/profile.service";
import { FormValidation } from "app/common_modules/form_validation";
import { Notification } from "../../../common_modules/notification";
import { Common } from "../../../common";
import "../../../../assets/plugins/jqwidgets/jqxbuttons.js";
import "../../../../assets/plugins/jqwidgets/jqxscrollbar.js";
import "../../../../assets/plugins/jqwidgets/jqxlistbox.js";
import "../../../../assets/plugins/jqwidgets/jqxcombobox.js";
import "../../../../assets/plugins/jqwidgets/jqxpanel.js";
import "../../../../assets/plugins/jqwidgets/jqxcheckbox.js";
import { StaticData } from "app/static-data";
import { Router } from "@angular/router";

declare let App;
declare let $;

@Component({
  selector: "app-lawfirm-create",
  templateUrl: "./lawfirm-create.component.html",
  styleUrls: ["./lawfirm-create.component.css"],
  providers: [LawfirmService, ProfileService]
})
export class LawfirmCreateComponent implements OnInit {
  lawfirm: Lawfirm = new Lawfirm();
  confirm_password: string;

  constructor(
    private _lawfirmService: LawfirmService,
    private _router: Router
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    let self = this;
    FormValidation.validate("lawfirm_create", function() {
      self.createLawfirm();
    });

    $(document).ready(function() {
      $("#countrySelector").jqxComboBox({
        theme: "metro",
        source: StaticData.countries,
        width: "100%",
        height: 35
      });

      $("#stateSelector").jqxComboBox({
        theme: "metro",
        source: StaticData.states,
        width: "100%",
        height: 35
      });
    });
  }

  onAptTypeChanged(event, type) {
    event.preventDefault();
    this.lawfirm.apt_type = type;
  }

  onSubmit() {}

  createLawfirm() {
    if (!this.lawfirm) {
      return;
    }
    this.lawfirm.state = $("#stateSelector").val();
    this.lawfirm.country = $("#countrySelector").val();
    if (this.lawfirm.state == "") {
      Notification.notifyAny({
        message: "The state field is required.",
        type: "error"
      });
      return;
    }
    if (this.lawfirm.country == "") {
      Notification.notifyAny({
        message: "The country field is required.",
        type: "error"
      });
      return;
    }
    if (this.lawfirm.password != this.confirm_password) {
      Notification.notifyAny({
        message: "The confirm password does not match.",
        type: "error"
      });
      return;
    }

    console.log("create", this.lawfirm);

    Common.showLoading();

    this._lawfirmService.createLawfirm(this.lawfirm).subscribe(
      data => {
        Common.hideLoading();

        let message = data.success.message;
        Notification.notifyAny({ message: message });

        this._router.navigate(["/pages/client/list"]);
      },
      error2 => {
        Common.hideLoading();
      }
    );
  }
}
