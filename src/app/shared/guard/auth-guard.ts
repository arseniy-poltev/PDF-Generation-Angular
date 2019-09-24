import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    if (localStorage.getItem('logged_in') == 'yes') {
      return true;
    }

    this.router.navigate(['/account/login']);
    return false;
  }
}
