import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import {Router} from '@angular/router';
import {Notification} from "../../common_modules/notification";
import { Common } from 'app/common';

declare let $;
declare let App;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: [
    '../../../assets/pages/css/contact.min.css',
    './contact-us.component.css',
  ],
  providers: [ProfileService],
})
export class ContactUsComponent implements OnInit {
  private email: string;
  private username: string;
  private phone: string;
  private message: string;

  constructor(private _profileService: ProfileService,
              private _router: Router) {
  }

  ngOnInit() {
  }

  contactUs(contactForm) {
    Common.showLoading();

    this._profileService.contactUSMail(this.email, this.username, this.phone, this.message)
      .subscribe(
        response => {
          Common.hideLoading();
          Notification.notifyAny({message: "Successfully sent email"});
          this.email = '';
          this.username = '';
          this.phone = '';
          this.message = '';
        },
        response => {
          Common.hideLoading();
          Notification.notifyAny({message: "Failed to send email"});
        }
      );
  }

  goSearch() {
    let key = $('#searchInput').val();
    if (key != '') {
      window.open('https://www.google.com/search?q=' + key, '_new');
    }
  }
}
