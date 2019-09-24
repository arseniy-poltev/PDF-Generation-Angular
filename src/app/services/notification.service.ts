import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Http, Response} from '@angular/http';
import {ErrorHandler} from "app/common_modules/error_handler";
import {Common} from 'app/common';

@Injectable()
export class NotificationService {

  constructor(private http: Http) {
  }

  getNotificationsByUser(id) {
    let url = Common.BASE_URL + '/api/v1/getNotificationsByUser/' + id + '?token=' + Common.getUser().token;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  readNotification(id) {
    let url = Common.BASE_URL + '/api/v1/readNotification/' + id + '?token=' + Common.getUser().token;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }
}
