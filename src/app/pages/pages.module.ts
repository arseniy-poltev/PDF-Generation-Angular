import { NgModule } from '@angular/core';
import {PagesRoutingModule} from "./pages-routing.module";
import {BrowserModule} from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from "../shared/components/components.module";

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LawfirmComponent } from './lawfirm/lawfirm.component';
import { LawfirmCreateComponent } from './lawfirm/lawfirm-create/lawfirm-create.component';
import { LawfirmProfileComponent } from './lawfirm/lawfirm-profile/lawfirm-profile.component';
import { ClientComponent } from './client/client.component';
import { FormComponent } from './form/form.component';
import { ClientCreateComponent } from './client/client-create/client-create.component';
import { ClientListComponent } from './client/client-list/client-list.component';
import { FormSelectComponent } from './form/form-select/form-select.component';
import { LawfirmLicenseComponent } from './lawfirm/lawfirm-license/lawfirm-license.component';
import { ClientReactivationComponent } from './client/client-reactivation/client-reactivation.component';
import { FormDocComponent } from './form/form-doc/form-doc.component';
import { LawfirmUserAssignmentComponent } from './lawfirm/lawfirm-user-assignment/lawfirm-user-assignment.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { LawfirmUserDetailComponent } from './lawfirm/lawfirm-user-assignment/lawfirm-user-detail/lawfirm-user-detail.component';
import { ClientDetailComponent } from './client/client-detail/client-detail.component';
import { ClientEditComponent } from './client/client-edit/client-edit.component';
import { MultiTableComponent } from './form/components/multi-table/multi-table.component';
import { ClientAddFormComponent } from './client/client-add-form/client-add-form.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AdminComponent } from './admin/admin.component';
import { PaginatorComponent } from './client/shared/paginator/paginator.component';
import { HeaderComponent } from './layout/header/header.component';
import { ClientFinishComponent } from './client/client-finish/client-finish.component';
import { FinishFormWidgetComponent } from './client/client-finish/finish-form-widget/finish-form-widget.component';
import { FormPrintComponent } from './form/form-print/form-print.component';
import { FormCellComponent } from './client/client-add-form/form-cell/form-cell.component';
import { ConfirmWindowComponent } from './layout/footer/confirm-window/confirm-window.component';
import { ClientPreviewComponent } from './client/client-preview/client-preview.component';
import { AvatarModule } from 'ng2-avatar';

@NgModule({
  imports: [
    PagesRoutingModule,
    BrowserModule,
    FormsModule,
    ComponentsModule,
    AvatarModule,
  ],
  declarations: [
    PagesComponent,
    DashboardComponent,
    LawfirmComponent,
    LawfirmCreateComponent,
    LawfirmProfileComponent,
    ClientComponent,
    FormComponent,
    ClientCreateComponent,
    ClientListComponent,
    FormSelectComponent,
    LawfirmLicenseComponent,
    ClientReactivationComponent,
    LawfirmUserAssignmentComponent,
    FooterComponent,
    NavbarComponent,
    LawfirmUserDetailComponent,
    ClientDetailComponent,
    ClientPreviewComponent,
    ClientEditComponent,
    MultiTableComponent,
    ClientAddFormComponent,
    AboutComponent,
    ContactUsComponent,
    AdminComponent,
    FormDocComponent,
    PaginatorComponent,
    HeaderComponent,
    ClientFinishComponent,
    FinishFormWidgetComponent,
    FormPrintComponent,
    FormCellComponent,
    ConfirmWindowComponent,
  ],
  bootstrap: [PagesComponent],
})
export class PagesModule { }
