import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Lawfirm } from "../../../models/lawfirm";
import { LawfirmService } from "app/services/lawfirm.service";
import { ProfileService } from "app/services/profile.service";
import { FormValidation } from "app/common_modules/form_validation";
import { Notification } from "../../../common_modules/notification";
import { Common } from "../../../common";
import { StaticData } from "app/static-data";

declare let $;
declare let App;

@Component({
  selector: "app-lawfirm-profile",
  templateUrl: "./lawfirm-profile.component.html",
  styleUrls: ["./lawfirm-profile.component.css"],
  providers: [LawfirmService, ProfileService]
})
export class LawfirmProfileComponent implements OnInit {
  private lawfirm: Lawfirm = new Lawfirm();

  constructor(private _lawfirmService: LawfirmService) {}

  ngOnInit() {
    this.getLawfirm();
  }

  ngAfterViewInit() {
    let self = this;
    FormValidation.validate("lawfirm_profile", function() {
      self.updateLawfirm();
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

  onSubmit() {}

  getLawfirm() {
    Common.showLoading();

    this._lawfirmService.getMyLawfirm().subscribe(data => {
      Common.hideLoading();

      console.log(data);
      this.lawfirm = data.lawfirm;
      $("#stateSelector").val(this.lawfirm.state);
      $("#countrySelector").val(this.lawfirm.country);
    });
  }

  onAptTypeChanged(event, type) {
    event.preventDefault();
    this.lawfirm.apt_type = type;
  }

  updateLawfirm() {
    if (!this.lawfirm) {
      return;
    }
    this.lawfirm.state = $("#stateSelector").val();
    if (this.lawfirm.state.trim() == "") {
      Notification.notifyAny({
        message: "The state field is required.",
        type: "error"
      });
      return;
    }
    this.lawfirm.country = $("#countrySelector").val();
    if ( this.lawfirm.country.trim() == "") {
      Notification.notifyAny({
        message: "The country field is required.",
        type: "error"
      });
      return;
    }

    Common.showLoading();

    this._lawfirmService.updateLawfirm(this.lawfirm).subscribe(
      data => {
        Common.hideLoading();

        let message = data.success.message;
        Notification.notifyAny({ message: message });
      },
      error => {
        Common.hideLoading();
      }
    );
  }
}
