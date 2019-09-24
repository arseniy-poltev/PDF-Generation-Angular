import { NgModule } from '@angular/core';
import { SharedRoutingModule } from './shared-routing.module';
import {AccountRoutingModule} from "./account/account-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

import { AccountComponent } from './account/account.component';
import { LoginComponent } from './account/login/login.component';
import { SignupComponent } from './account/signup/signup.component';
import { ProfileComponent } from './account/profile/profile.component';
import { PasswordComponent } from './account/password/password.component';
import { ForgotPasswordComponent } from './account/password/forgot-password/forgot-password.component';
import { SendEmailComponent } from './account/password/send-email/send-email.component';
import { ResetPasswordComponent } from './account/password/reset-password/reset-password.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterVerifyComponent } from './account/signup/register-verify/register-verify.component';
import { CommonModule } from '@angular/common';
import { TypeComponent } from './account/type/type.component';
import { LawfirmSignupComponent } from './account/lawfirm-signup/lawfirm-signup.component';
import { HttpModule } from '@angular/http';
import { AvatarModule } from 'ng2-avatar';
import { SharedComponent } from './shared.component';

@NgModule({
  imports: [
    SharedRoutingModule,
    AccountRoutingModule,
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpModule,
    AvatarModule,
  ],
  declarations: [
    AccountComponent,
    LoginComponent,
    SignupComponent,
    RegisterVerifyComponent,
    ProfileComponent,
    PasswordComponent,
    ForgotPasswordComponent,
    SendEmailComponent,
    ResetPasswordComponent,
    NotFoundComponent,
    TypeComponent,
    LawfirmSignupComponent,
    SharedComponent,
  ]
})
export class SharedModule {}
