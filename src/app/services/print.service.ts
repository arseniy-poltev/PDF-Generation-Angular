import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Http, Response } from "@angular/http";
import { ErrorHandler } from "app/common_modules/error_handler";
import { Common } from "app/common";

@Injectable()
export class PrintService {
  constructor(private http: Http) {}

  print(pdfKeyValues, form_type, doc_name, host) {
    let url =
      Common.BASE_URL + "/api/printHtml?token=" + Common.getUser().token;
    let body = {
      pdf_data: pdfKeyValues,
      form_type: form_type,
      doc_name: doc_name,
      host: host
    };
    return this.http
      .post(url, body)
      .map((response: Response) => response.json())
      .do(data => data)
      .catch(ErrorHandler.handleError);
  }
}
