import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";/**
 * Created by steve on 6/10/2018.
 */

import {PaginationComponent} from "./pagination/pagination.component";
import {DropdownlistComponent} from "./dropdownlist/dropdownlist.component";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
  ],
  declarations: [
    PaginationComponent,
    DropdownlistComponent,
  ],
  exports: [
    PaginationComponent,
    DropdownlistComponent,
  ]
})
export class ComponentsModule { }
