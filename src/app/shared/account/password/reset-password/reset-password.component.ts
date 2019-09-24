import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../../services/user.service";
import {Router} from "@angular/router";
import {Notification} from "../../../../common_modules/notification";

declare let bootbox;

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [UserService],
})
export class ResetPasswordComponent implements OnInit {
  static instance: ResetPasswordComponent;
  retype_password;
  password;

  constructor(private _router: Router, private _userService: UserService) {
    ResetPasswordComponent.instance = this;
  }

  ngOnInit() {
  }

  onSubmit(form) {
    if (this.password != this.retype_password) {
      Notification.notifyAny({message: 'Retype password exactly.', type: 'error'});
      return;
    }

    let array = this._router.url.split('/');
    let array1 = array[array.length - 1].split('_fi35_');
    let email = atob(array1[0]);
    let md_password = array1[1];
    this._userService.resetPassword(email, this.password, md_password)
      .subscribe(
        response => {
          Notification.notifyAny({message: response.success.message});
          ResetPasswordComponent.instance._router.navigate(['/account/login']);
        });
  }
}
