import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Common } from "../common";
import { ErrorHandler } from "../common_modules/error_handler";
import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";

@Injectable()
export class FormService {
  _formUrl = Common.BASE_URL + "/api/v1/forms";

  constructor(private http: Http) {}

  getForms() {
    let url = this._formUrl + "?token=" + Common.getUser().token;
    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getForm(id) {
    let url = this._formUrl + "/" + id + "?token=" + Common.getUser().token;
    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  updateForm(form) {
    let url =
      this._formUrl + "/" + form.id + "?token=" + Common.getUser().token;
    return this.http
      .put(url, form)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }

  getFormsWithoutTemplate() {
    let url =
      this._formUrl +
      "?fields=id,type,name,description&start_form=1&token=" +
      Common.getUser().token;
    return this.http
      .get(url)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }
}
