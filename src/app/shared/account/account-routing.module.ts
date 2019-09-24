import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import {AccountComponent} from "./account.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {ProfileComponent} from "./profile/profile.component";
import {ForgotPasswordComponent} from "./password/forgot-password/forgot-password.component";
import {SendEmailComponent} from "./password/send-email/send-email.component";
import {ResetPasswordComponent} from "./password/reset-password/reset-password.component";
import { RegisterVerifyComponent } from './signup/register-verify/register-verify.component';
import { TypeComponent } from './type/type.component';
import { LawfirmSignupComponent } from './lawfirm-signup/lawfirm-signup.component';


const pageRoutes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'type', component: TypeComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'lawfirm', component: LawfirmSignupComponent },
      { path: 'register/verify/:confirmation_code', component: RegisterVerifyComponent },
      {
        path: 'password',
        children: [
          { path: 'forgot', component: ForgotPasswordComponent },
          { path: 'send_email', component: SendEmailComponent },
          { path: 'reset/:password', component: ResetPasswordComponent },
        ],
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(pageRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [],
})
export class AccountRoutingModule { }
