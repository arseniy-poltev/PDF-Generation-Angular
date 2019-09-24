import { Component, OnInit, AfterViewInit } from "@angular/core";
import { User } from "../../../models/user";
import { Profile } from "../../../models/profile";
import { Common } from "../../../common";
import { UserService } from "../../../services/user.service";
import { Router } from "@angular/router";
import { ProfileService } from "../../../services/profile.service";
import { LawfirmService } from "../../../services/lawfirm.service";
import { Notification } from "../../../common_modules/notification";
import { InviteService } from "../../../services/invite.service";

import "../../../../assets/plugins/jqwidgets/jqxdata.js";
import "../../../../assets/plugins/jqwidgets/jqxbuttons.js";
import "../../../../assets/plugins/jqwidgets/jqxscrollbar.js";
import "../../../../assets/plugins/jqwidgets/jqxlistbox.js";
import "../../../../assets/plugins/jqwidgets/jqxcombobox.js";
import { StaticData } from "app/static-data";

declare let $;
declare let bootbox;
declare let App;
declare let faker;

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
  providers: [UserService, ProfileService, LawfirmService, InviteService]
})
export class SignupComponent implements OnInit {
  static instance: SignupComponent;
  private role;

  private captcha_image;
  private captcha_key;
  private captcha_value;

  private retype_password;
  private user: User;
  private profile: Profile;
  private lawfirm_password;
  private lawfirm_name;
  private lawfirms = [];

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _profileService: ProfileService,
    private _lawfirmService: LawfirmService,
    private _inviteService: InviteService
  ) {
    SignupComponent.instance = this;
  }

  ngOnInit() {
    this.captcha_image = "";
    this.captcha_key = "";
    this.captcha_value = "";

    this.role = "attorney";
    this.user = new User();
    this.profile = new Profile();
    this.profile.accereditation_expires_date = Common.getPhpDate(new Date());
    this.profile.is_attorney = true;
    this.profile.is_subject_to_any = false;

    // DEBUG: Test code here
    // this.profile.first_name = faker.name.findName().split(" ")[0];
    // this.profile.middle_name = faker.name.findName().split(" ")[1];
    // this.profile.last_name = faker.name.findName().split(" ")[1];
    // this.profile.telephone_number = faker.phone.phoneNumber();
    // this.profile.mobile_number = faker.phone.phoneNumber();
    // this.profile.fax_number = faker.phone.phoneNumber();
    // this.profile.street = faker.address.streetAddress();
    // this.profile.apt_number = "ABC123";
    // this.profile.city = faker.address.city();
    // // this.profile.state = faker.address.state();
    // this.profile.zip_code = faker.address.zipCode();
    // this.profile.province = faker.address.state();
    // // this.profile.country = faker.address.country();
    // this.profile.uscis_account_number = "123456789";
    // this.profile.licensing_authority = faker.company.companyName();
    // this.profile.bar_number = "684516843";
    // this.profile.preparer_signature = "321543872";
    // this.user.password = '123456';
    // this.retype_password = '123456';
    // this.lawfirm_password = '123456';

    this.getLawfirms();
    this.getCaptcha();
  }

  ngAfterViewInit() {
    let self = this;
    this.profile.lawfirm_id = 1;

    InitWidgets();
    InitEvents();

    function InitWidgets() {
      $("#countrySelector").jqxComboBox({
        theme: "metro",
        source: StaticData.countries,
        width: "100%",
        height: 31,
        itemHeight: 30
      });

      $("#stateSelector").jqxComboBox({
        theme: "metro",
        source: StaticData.states,
        width: "100%",
        height: 31,
        itemHeight: 30
      });
    }

    function InitEvents() {
      $("#isSubjectCheck").change(function() {
        self.profile.is_subject_to_any = $(this)[0].checked;
      });

      $("#isAttorneyCheck").change(function() {
        let checked = $(this)[0].checked;
        if (checked) {
          self.SelectRole("attorney");
        } else {
          self.SelectRole("paralegal");
        }
      });

      $("#countrySelector").on("select", function(event) {
        self.profile.country = $(this).val();
      });

      $("#stateSelector").on("select", function(event) {
        self.profile.state = $(this).val();
      });

      $("#lawfirmNameInput").keyup(function() {
        self.profile.lawfirm_id = self.getLawfirmId($(this).val());
      });
    }
  }

  getLawfirmId(lawfirmName) {
    for (var i = 0; i < this.lawfirms.length; i++) {
      if (this.lawfirms[i].name === lawfirmName) {
        return this.lawfirms[i].id;
      }
    }

    return null;
  }

  onAptTypeChanged(event, type) {
    event.preventDefault();

    this.profile.apt_type = type;
  }

  SelectRole(role) {
    this.role = role;
    this.profile.is_attorney = role == "attorney";
  }

  getLawfirms() {
    this._lawfirmService.getLawfirms().subscribe(data => {
      this.lawfirms = data.data;
    });
  }

  onSubmit(form) {
    if (Common.isNone(this.profile.country)) {
      Notification.notifyAny({
        message: "Please select the country!",
        type: "error"
      });
      return;
    }
    if (Common.isNone(this.profile.state)) {
      Notification.notifyAny({
        message: "Please select the state!",
        type: "error"
      });
      return;
    }
    this._userService
      .checkCaptcha(this.captcha_value, this.captcha_key)
      .subscribe(data => {
        if (data.json().success) {
          if (this.profile.lawfirm_id === null) {
            Notification.notifyAny({
              message: "The lawfirm does not exist!",
              type: "error"
            });
            return;
          }
          let lawfirm = {
            id: this.profile.lawfirm_id,
            password: this.lawfirm_password
          };
          if (this.user.password != this.retype_password) {
            Notification.notifyAny({
              message: "Confirm password does not match!",
              type: "error"
            });
            return;
          }

          this._lawfirmService.confirmLawfirm(lawfirm).subscribe(success => {
            console.log(this.user.email);
            Common.showLoading();

            this._userService
              .signup(
                this.user.email,
                this.user.password,
                this.role,
                this.profile
              )
              .subscribe(
                success => {
                  Common.hideLoading();

                  let html =
                    '<div class="center">\n' +
                    "  <b>Account registration processed.</b><br>\n" +
                    "  [" +
                    this.profile.last_name +
                    ", " +
                    this.profile.first_name +
                    " - " +
                    this.user.email +
                    "]\n" +
                    "</div><br>\n" +
                    "<p>\n" +
                    "  Congratulations, you have registered successfully!\n" +
                    "</p>\n" +
                    "<p>\n" +
                    "  You are now not available to login.\n" +
                    "</p>\n" +
                    "<p>\n" +
                    "  Please check your email inbox now for verification.\n" +
                    "</p>";
                  bootbox.alert(html, function() {
                    SignupComponent.instance._router.navigate(["/"]);
                  });
                },
                error => {
                  Common.hideLoading();
                }
              );
          });
        } else {
          this.captcha_image = data.json().img;
          this.captcha_key = data.json().key;
          Notification.notifyAny({
            message: "Type the correct captcha!",
            type: "error"
          });
          $("#captcha").val("");
        }
      });
  }

  back() {
    window.history.back();
  }

  getCaptcha() {
    this._userService.getCaptcha().subscribe(data => {
      this.captcha_image = data.json().img;
      this.captcha_key = data.json().key;
    });
  }
}
