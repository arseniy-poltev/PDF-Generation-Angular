import { Component, OnInit } from "@angular/core";
import { LawfirmService } from "../../../services/lawfirm.service";
import { ProfileService } from "../../../services/profile.service";
import { Notification } from "../../../common_modules/notification";
import { Lawfirm } from "../../../models/lawfirm";
import { Common } from "../../../common";
import "../../../../assets/plugins/jqwidgets/jqxdata.js";
import "../../../../assets/plugins/jqwidgets/jqxbuttons.js";
import "../../../../assets/plugins/jqwidgets/jqxscrollbar.js";
import "../../../../assets/plugins/jqwidgets/jqxlistbox.js";
import { StaticData } from "app/static-data";

declare let $;
declare let App;

@Component({
  selector: "app-admin-lawfirm",
  templateUrl: "./admin-lawfirm.component.html",
  styleUrls: [
    "./admin-lawfirm.component.css",
    "../../../../assets/common/css/admin.css"
  ],
  providers: [LawfirmService, ProfileService]
})
export class AdminLawfirmComponent implements OnInit {
  static instance: AdminLawfirmComponent;
  private lawfirms;
  private count;
  lawfirm: Lawfirm = new Lawfirm();

  constructor(private _lawfirmService: LawfirmService) {
    AdminLawfirmComponent.instance = this;
  }

  ngOnInit() {
    this.getLawfirms();
  }

  ngAfterViewInit() {
    $(document).ready(function() {
      InitWidgets();
      InitEvents();

      function InitWidgets() {
        $("#lawfirmList").jqxListBox({
          theme: "metro",
          displayMember: "name",
          valueMember: "id",
          width: "100%",
          height: 400
        });

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
      }

      function InitEvents() {
        $("#lawfirmList").on("select", function() {
          AdminLawfirmComponent.instance.refreshForm();
        });
      }
    });
  }

  onAptTypeChanged(event, type) {
    event.preventDefault();

    this.lawfirm.apt_type = type;
  }

  getLawfirms() {
    Common.showLoading();
    let selected_id = $("#lawfirmList").val();

    this._lawfirmService.getLawfirms().subscribe(data => {
      this.lawfirms = data.data;
      this.count = this.lawfirms.length;

      let source = {
        datatype: "json",
        datafields: [{ name: "id" }, { name: "name" }],
        id: "id",
        localdata: data
      };
      let dataAdapter = new $.jqx.dataAdapter(source);

      $("#lawfirmList").jqxListBox({
        source: dataAdapter
      });
      if (Common.isNone(selected_id)) {
        $("#lawfirmList").jqxListBox("selectedIndex", 0);
      } else {
        $("#lawfirmList").val(selected_id);
      }

      Common.hideLoading();
    });
  }

  getLawfirmById(id) {
    for (let i in this.lawfirms) {
      let lawfirm = this.lawfirms[i];
      if (lawfirm.id == id) {
        return lawfirm;
      }
    }

    return null;
  }

  refreshForm() {
    let id = $("#lawfirmList").val();
    this.lawfirm = this.getLawfirmById(id);
    $("#countrySelector").val(this.lawfirm.country);
    $("#stateSelector").val(this.lawfirm.state);
    console.log(this.lawfirm);
  }

  resetForm() {
    this.lawfirm = new Lawfirm();
    $("#countrySelector").val(this.lawfirm.country);
    $("#stateSelector").val(this.lawfirm.state);
  }

  updateLawfirm() {
    this._lawfirmService.updateLawfirm(this.lawfirm).subscribe(data => {
      let message = data.success.message;
      Notification.notifyAny({ message: message });
      this.getLawfirms();
    });
  }

  deleteLawfirm() {
    let id = $("#lawfirmList").val();
    let self = this;

    Common.confirm("Do you want to delete the lawfirm?", function() {
      self._lawfirmService.deleteLawfirm(id).subscribe(data => {
        let message = data.success.message;
        Notification.notifyAny({ message: message });
        self.getLawfirms();
      });
    });
  }
}
