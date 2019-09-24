import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Router} from '@angular/router';
import {Common} from "../../common";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate() {
    let role = Common.getUser().role;
    if (role == 'admin' || role == 'superadmin') {
      return true;
    }

    this.router.navigate(['/account/login']);
    return false;
  }
}
