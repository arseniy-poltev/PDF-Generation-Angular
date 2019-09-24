import { Component, OnInit } from '@angular/core';
import {Client} from "../../../models/client";
import {Router} from "@angular/router";

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClientEditComponent implements OnInit {

  private client: Client;
  private currentPage: number;
  private currentType: number;
  private pageCount: number;
  private client_id: number;

  constructor(private _router : Router) {

  }

  ngOnInit() {
    this.currentType = 7;
    this.currentPage = 1;
    this.pageCount = 12;
    this.client_id =  parseInt(this._router.url.split('/')[4]);
    console.log(this.client_id);
  }

  pageSelected(event) {
    this.currentPage = event;
    console.log(event);

  }

}
