import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {Common} from "./common";
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent {
  private checked: boolean = false;
  private url: string;

  ngOnInit() {
  }

  constructor(private _router: Router, private _userService: UserService) {
  }

  ngDoCheck() {
    if (this.checked) {
      let user = Common.getUser();
      // if (this.url != this._router.url) { // Get user login status
      //   this.url = this._router.url;
      //   if (user.is_logged()) {
      //     this._userService.getTokenStatus(user.token)
      //       .subscribe(data => {
      //       }, error => {
      //         Common.logout();
      //         this._router.navigate(['/']);
      //       });
      //   }
      // }

      if (this._router.url == '/') { // Go to first page
        if (user.is_logged()) {
          this._router.navigate(['/pages/client/list']);
        } else {
          this._router.navigate(['/pages/dashboard']);
        }
      }
    }
    else {
      this.checked = true;
    }
  }
}
