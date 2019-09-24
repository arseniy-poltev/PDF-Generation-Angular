import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import { Router } from "@angular/router";
import { Doc } from "../models/doc";
import { Common } from "app/common";
import { Headers, RequestOptions } from "@angular/http";
import { ErrorHandler } from "../common_modules/error_handler";

@Injectable()
export class DocService {
  private _tokenSuffix: string = "?&token=" + Common.getUser().token;
  private _docUrl: string = Common.BASE_URL + "/api/v1/docs";

  constructor(private router: Router, private http: Http) {}

  selectDocs(client_id, form_ids) {
    let url = this._docUrl + "/selectDocs?token=" + Common.getUser().token;
    let body = { ids: form_ids, client_id: client_id };
    return this.http
      .post(url, body)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  addClientDoc(client_id, form_ids) {
    let url = this._docUrl + "/addClientDoc?token=" + Common.getUser().token;
    let body = { ids: form_ids, client_id: client_id };
    return this.http
      .post(url, body)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  deleteDocs(client_id, form_ids) {
    let url = this._docUrl + "/deleteDocs?token=" + Common.getUser().token;
    let body = { ids: form_ids, client_id: client_id };
    return this.http
      .post(url, body)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  createDoc(data, client_id, form_id) {
    let url = this._docUrl + "?token=" + Common.getUser().token;
    return this.http
      .post(url, {
        data: data,
        client_id: client_id,
        form_id: form_id
      })
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getDoc(doc_id) {
    let url = this._docUrl + "/" + doc_id + "?token=" + Common.getUser().token;
    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getDocByClientForm(client_id, form_id) {
    let url =
      Common.BASE_URL +
      "/api/v1/getDoc?client_id=" +
      client_id +
      "&form_id=" +
      form_id +
      "&token=" +
      Common.getUser().token;
    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  updateDoc(data, doc_id) {
    let url = this._docUrl + "/" + doc_id + "?token=" + Common.getUser().token;
    return this.http
      .patch(url, { data: data })
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  approveDismissDoc(doc_id, approve) {
    let url =
      Common.BASE_URL +
      "/api/v1/docs/approveDismiss?doc_id=" +
      doc_id +
      "&approve=" +
      approve +
      "&token=" +
      Common.getUser().token;
    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }
}
