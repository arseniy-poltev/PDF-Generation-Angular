import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {User} from "../../../../models/user";
import {UserService} from "../../../../services/user.service";
import { Common } from "../../../../common";

declare let $;
declare let bootbox;

@Component({
  selector: 'app-lawfirm-user-detail',
  templateUrl: './lawfirm-user-detail.component.html',
  styleUrls: ['./lawfirm-user-detail.component.css'],
  providers: [UserService]
})
export class LawfirmUserDetailComponent implements OnInit {

  private user: User = new User();
  private fullName;
  private avatarExist = true;
  private avatarBackground = '#5b00ff';

  constructor(private _userService: UserService,
              private _router: Router,) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.fullName = this.user.profile['first_name'] + ' ' + this.user.profile['last_name'];
    this.avatarExist = this.user.profile['avatar'].indexOf('avatar.png') < 0;
    this.avatarBackground = Common.stringToHslColor(this.fullName);
  }

  back() {
    window.history.back();
  }

  onApprove(id) {
    this._userService.approveUser([id])
      .subscribe(data => {
        this._router.navigate(['/pages/lawfirm/user_assignment']);
      });
  }

  onDismiss(id) {
    this._userService.dismissUser([id])
      .subscribe(data => {
        this._router.navigate(['/pages/lawfirm/user_assignment']);
      });
  }
}
