import {Component, OnInit} from '@angular/core';
import {Common} from "../../../../common";
import {UserService} from "../../../../services/user.service";
import {Http, Response} from '@angular/http';
import {Router} from "@angular/router";
import {Notification} from "../../../../common_modules/notification";

declare let bootbox;
declare let $;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [UserService],
})
export class ForgotPasswordComponent implements OnInit {
  email;

  constructor(private router: Router, private _userService: UserService, private http: Http) {
  }

  ngOnInit() {
  }

  onSubmit(form) {
    Common.showLoading();

    let url = window.location.origin;
    this._userService.forgetpassword(this.email, url)
      .subscribe(data => {
        Common.hideLoading();
        Notification.notifyAny({message: 'Success to send email. Look your email inbox.'});
      }, error => {
        Common.hideLoading();
      });
  }

  back() {
    window.history.back();
  }
}
