import { Component } from "@angular/core";
import { Lawfirm } from "../../../models/lawfirm";
import { LawfirmService } from "../../../services/lawfirm.service";
import { FormValidation } from "../../../common_modules/form_validation";
import { Common } from "../../../common";
import { Notification } from "../../../common_modules/notification";
import { ProfileService } from "../../../services/profile.service";
import { Router } from "@angular/router";
import { StaticData } from "app/static-data";

declare let $;
declare let App;
declare let bootbox;

@Component({
  selector: "app-lawfirm-signup",
  templateUrl: "./lawfirm-signup.component.html",
  styleUrls: ["./lawfirm-signup.component.css"],
  providers: [LawfirmService, ProfileService]
})
export class LawfirmSignupComponent {
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
        height: 32
      });

      $("#stateSelector").jqxComboBox({
        theme: "metro",
        source: StaticData.states,
        width: "100%",
        height: 32
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

    Common.showLoading();

    this._lawfirmService.createLawfirm(this.lawfirm).subscribe(
      data => {
        Common.hideLoading();

        let message = data.success.message;
        let self = this;
        bootbox.dialog({
          message: message,
          buttons: {
            ok: {
              label: "OK",
              className: "btn-primary",
              callback: function() {
                self._router.navigate(["/"]);
              }
            }
          }
        });
      },
      error2 => {
        Common.hideLoading();
      }
    );
  }

  back() {
    window.history.back();
  }
}
