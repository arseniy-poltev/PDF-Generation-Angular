import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import {Router} from "@angular/router";
import {Client} from "../models/client";
import {Common} from 'app/common';
import {ErrorHandler} from "../common_modules/error_handler";

@Injectable()
export class ClientService {
  private _clientUrl: string = Common.BASE_URL + '/api/v1/clients';

  constructor(private  router: Router, private http: Http) {
  }

  getClients() {
    let url = this._clientUrl + '?token=' + Common.getUser().token;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getUserClients() {
    let user = Common.getUser();
    let url = this._clientUrl + '/getUserClients/' + user.user_id + '?token=' + user.token;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getLawfirmClients() {
    let url = this._clientUrl + '/getLawfirmClients?token=' + Common.getUser().token;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getClient(id) {
    let url = this._clientUrl + "/" + id + '?token=' + Common.getUser().token;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getDocsByClientId(id) {
    let url = this._clientUrl + '/' + id + '?include=docs:fields(id|client_id|form_id|form_type|form_name|page_count|approved):sort(form_id|asc)&token=' + Common.getUser().token;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getDeletedClients() {
    let url = this._clientUrl + '/getDeletedClients?token=' + Common.getUser().token;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  deleteClient(id) {
    let url = this._clientUrl + '/' + id + '?token=' + Common.getUser().token;
    return this.http.delete(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  deleteClients(ids) {
    let url = this._clientUrl + '/deleteClients' + '?token=' + Common.getUser().token;
    return this.http.post(url, {ids: ids})
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  reactivateClients(ids) {
    let url = this._clientUrl + '/reactivateClients?token=' + Common.getUser().token;
    return this.http.post(url, {ids: ids})
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getForms(id) {
    let url = this._clientUrl + "/getForms/" + id + '?token=' + Common.getUser().token;
    return this.http.get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  createClient(data) {
    let url = this._clientUrl + '?token=' + Common.getUser().token;
    return this.http.post(url, {data: data})
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  updateClient(data, id) {
    let url = this._clientUrl + '/' + id + '?token=' + Common.getUser().token;
    return this.http.patch(url, {data: data})
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }
}
