import { NgModule } from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import {AdminRoutingModule} from "./admin-routing.module";
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminFormComponent } from './admin-form/admin-form.component';
import {AdminComponent} from "./admin.component";
//import {PaginationComponent} from "../../shared/components/pagination/pagination.component";
//import {DropdownlistComponent} from "../../shared/components/dropdownlist/dropdownlist.component";
import { AdminFormSchemaComponent } from './admin-form/admin-form-schema/admin-form-schema.component';
import { ComponentsModule } from "../../shared/components/components.module";
import { AdminLawfirmComponent } from './admin-lawfirm/admin-lawfirm.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AdminRoutingModule,
    ComponentsModule,
  ],
  declarations: [
    AdminUserComponent,
    AdminFormComponent,
    //PaginationComponent,
    //DropdownlistComponent,
    AdminFormSchemaComponent,
    AdminLawfirmComponent,
  ],
  bootstrap: [AdminComponent],
})
export class AdminModule { }
