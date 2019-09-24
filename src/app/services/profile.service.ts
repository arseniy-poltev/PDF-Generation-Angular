import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from "rxjs/Observable";
import {Profile} from "../models/profile"
import {Router} from "@angular/router";
import {Common} from "../common";
import {ErrorHandler} from "../common_modules/error_handler";
import {Notification} from "../common_modules/notification";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

declare let bootbox: any;
declare let $: any;

@Injectable()
export class ProfileService {
  private _profileUrl: string = Common.BASE_URL + '/api/v1/profiles';

  constructor(private  router: Router, private http: Http) {
  }

  getAllProfiles(): Observable<Profile[]> {
    let url = this._profileUrl + '?token=' + Common.getUser().token;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getMyProfile(): Observable<Profile> {
    let user = Common.getUser();
    let url = Common.BASE_URL + '/api/v1/getProfile/' + user.user_id + '?include=lawfirm,user&token=' + user.token;
    return this.http.get(url)
      .map((response: Response) => <Profile> response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  changePassword(current_password: string, new_password: string, id: number) {
    let body = {
      id: id,
      old_password: current_password,
      new_password: new_password,
    };
    let url = Common.BASE_URL + '/api/v1/updatePassword/' + id + '?token=' + Common.getUser().token;

    return this.http.patch(url, body)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  saveProfile(profile: Profile) {

    let body = profile;
    let url = this._profileUrl + '/' + profile.id + '?token=' + Common.getUser().token;
    
    return this.http.put(url, body)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  changeAvatar(id, avatar) {
    let url = this._profileUrl + '/' + id + '?token=' + Common.getUser().token;

    return this.http.put(url, {avatar: avatar})
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  contactUSMail(email: string, name: string, phone: string, message: string) {
    let body = {
      email: email,
      username: name,
      phone: phone,
      message: message,
      token: Common.getUser().token
    };
    return this.http.post(Common.BASE_URL + '/api/contactUs', body)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

}
