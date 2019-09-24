import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {ProfileService} from "./profile.service";
import {Lawfirm} from 'app/models/lawfirm';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {Common} from 'app/common';
import {ErrorHandler} from "app/common_modules/error_handler";

@Injectable()
export class LawfirmService {
  private _tokenSuffix: string = '?&token=' + Common.getUser().token;
  private _lawfirmUrl: string = Common.BASE_URL + '/api/v1/lawfirms';

  constructor(private http: Http, private _profileService: ProfileService) {
  }

  getMyLawfirm() {
    return this._profileService.getMyProfile();
  }

  createLawfirm(lawfirm) {
    let url = this._lawfirmUrl + '?token=' + Common.getUser().token;

    return this.http.post(url, lawfirm)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  updateLawfirm(lawfirm) {
    let url = this._lawfirmUrl + '/' + lawfirm.id + this._tokenSuffix;

    return this.http.patch(url, lawfirm)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  deleteLawfirm(id) {
    let url = this._lawfirmUrl + '/' + id + this._tokenSuffix;
    return this.http.delete(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getLawfirms() {
    let url = this._lawfirmUrl;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  confirmLawfirm(lawfirm) {
    let url = Common.BASE_URL + '/api/confirmLawfirm';
    return this.http.post(url, lawfirm)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }
}
