import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {Router} from "@angular/router";
import {Common} from "../../../common";
import {isNullOrUndefined} from "util";
import {User} from "../../../models/user";
import {UserService} from "../../../services/user.service";
import {NotificationService} from "../../../services/notification.service";
import {Notification} from "../../../common_modules/notification";

declare let RunLayout;
declare let jQuery;
declare let $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [UserService, NotificationService]
})
export class NavbarComponent implements OnInit {
  static instance: NavbarComponent;
  pages = Common.pages;
  private notifications;
  @Input() user;
  @Input() url: string;
  @Input() profile;
  @Input() fullName;
  @Input() avatarExist;
  @Input() avatarBackground;

  constructor(private router: Router, private _userService: UserService, private _notificationService: NotificationService) {
    NavbarComponent.instance = this;
  }

  ngOnInit() {
  }

  navigate(path) {
    if (path.search("#") < 0) {
      this.router.navigate([path]);
    }
  }

  ngOnChanges() {
    $("html, body").animate({scrollTop: 0}, 500);
    this.refreshActives();
  }

  refreshActives() {
    for (let i in this.pages) {
      let page = this.pages[i];
      let children = page.children;
      let flag = false;
      for (let j in children) {
        let child = children[j];
        if (this.url.search(child.path) >= 0) {
          this.pages[i].children[j].active = true;
          flag = true;
        } else {
          this.pages[i].children[j].active = false;
        }
      }
      this.pages[i].active = flag || this.url.search(page.path) >= 0;
    }

    this.refreshNotifications();
  }

  is_show(page) {
    if ((page.title == 'Law Firm' || page.title == 'Client Reactivation') && this.user.role == 'paralegal') {
      return false;
    }

    if (isNullOrUndefined(page.show)) {
      return true;
    }

    return (page.show == 'logged_in' && this.user.is_logged()) ||
      (page.show == 'logged_out' && !this.user.is_logged());
  }

  logout() {
    Common.logout();
    this.router.navigate(['/']);
  }

  refreshNotifications() {
    if(Common.loggedIn()) {
      this._notificationService.getNotificationsByUser(Common.getUser().user_id)
        .subscribe(data => {
          this.notifications = data;
        });
    }
  }

  readNotification(notification) {
    if(notification.type == 'client_deletion') {
      this._notificationService.readNotification(notification.id)
        .subscribe(data => {
          let message = data.success.message;
          Notification.notifyAny({message: message});
          this.router.navigate(['/pages/client/reactivation']);
          this.refreshNotifications();
        });
    }
  }
}
