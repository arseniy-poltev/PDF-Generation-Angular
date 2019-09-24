import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Common} from "../common";
import {ErrorHandler} from "../common_modules/error_handler";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class InviteService {

  constructor(private http: Http) {
  }

  getInvites(lawfirm_id) {
    let url = Common.BASE_URL + '/api/v1/invites/getInvites' + '?token=' + Common.getUser().token + '&lawfirm_id=' + lawfirm_id;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  addInvite(invite) {
    let url = Common.BASE_URL + '/api/v1/invites?token=' + Common.getUser().token;
    return this.http.post(url, invite)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  removeInvite(id) {
    let url = Common.BASE_URL + '/api/v1/invites/' + id + '?token=' + Common.getUser().token;
    return this.http.delete(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getInvitesByEmail(email) {
    let url = Common.BASE_URL + '/api/invites/getInvitesByEmail?email=' + email;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getAllInvites() {
    let url = Common.BASE_URL + '/api/invites/getAllInvites';
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }
}
