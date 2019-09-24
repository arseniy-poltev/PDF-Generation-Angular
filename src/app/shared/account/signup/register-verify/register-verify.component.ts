import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Common} from "../../../../common";
import {Router} from "@angular/router";
import { Notification } from '../../../../common_modules/notification';
import { UserService } from '../../../../services/user.service';


declare let $;
declare let bootbox;
declare let App;

@Component({
  selector: 'app-register-verify',
  templateUrl: './register-verify.component.html',
  styleUrls: [
    './register-verify.component.css',
  ],
  providers: [
    UserService
  ],
})
export class RegisterVerifyComponent implements OnInit {

  public password = "";
  public confirmation_code;

  constructor(private _router: Router, private _userService: UserService) {}

  ngOnInit() {
    let array = this._router.url.split("/");
    this.confirmation_code = array[array.length - 1];
  }

  ngAfterViewInit() {
    
  }

  verify(event) {
    event.preventDefault();

    let data = {
      password: this.password,
      confirmation_code: this.confirmation_code
    }

    console.log('verify', data);

    Common.showLoading();
    
    this._userService.verifyRegister(data)
      .subscribe(data => {
        Common.hideLoading();
        console.log(data);

        let html = 
          '<div class="center">\n' +
          '  <b>Registration verification succeed!</b><br>\n' +
          '</div><br>\n' +
          '<p>\n' +
            data['success']['message'] +
          '</p>';
        
        let self = this;
        bootbox.alert(html, function () {
          self._router.navigate(['/']);
        });
      }, error => {
        Common.hideLoading();
      });
  }
}