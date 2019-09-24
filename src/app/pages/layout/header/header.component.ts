import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Common} from "../../../common";
import {ProfileService} from "../../../services/profile.service";
import {Profile} from "../../../models/profile";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [
    ProfileService
  ]
})
export class HeaderComponent implements OnInit {
  static instance: HeaderComponent;
  private url: string;
  private page;
  private parent;
  private user;
  private profile: Profile;
  private fullName;
  private avatarExist = true;
  private avatarBackground = "#5b00ff";

  constructor(private router: Router, private _profileService: ProfileService) {
    HeaderComponent.instance = this;
  }

  ngOnInit() {
    this.user = Common.getUser();
    this.refreshProfile();
  }

  public refreshProfile() {
    if (this.user.logged_in == 'yes') {
      this._profileService.getMyProfile().subscribe(
        profile => {
          this.profile = profile;
          this.fullName = profile.first_name + ' ' + profile.last_name;
          this.avatarExist = profile.avatar.indexOf("avatar.png") < 0;
          this.avatarBackground = Common.stringToHslColor(this.fullName);
        },
      );
    }
  }

  ngDoCheck() {
    if (this.url != this.router.url) {
      this.user = Common.getUser();
      this.url = this.router.url;
      this.page = Common.getPage(this.url);
      this.parent = Common.getParentPage(this.page);
    }
  }
}
