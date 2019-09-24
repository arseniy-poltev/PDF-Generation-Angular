import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

import {PagesComponent} from "./pages.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {LawfirmCreateComponent} from "./lawfirm/lawfirm-create/lawfirm-create.component";
import {LawfirmProfileComponent} from "./lawfirm/lawfirm-profile/lawfirm-profile.component";
import {LawfirmLicenseComponent} from "./lawfirm/lawfirm-license/lawfirm-license.component";
import {LawfirmUserAssignmentComponent} from "./lawfirm/lawfirm-user-assignment/lawfirm-user-assignment.component";
import {LawfirmUserDetailComponent} from "./lawfirm/lawfirm-user-assignment/lawfirm-user-detail/lawfirm-user-detail.component";
import {ClientCreateComponent} from "./client/client-create/client-create.component";
import {ClientListComponent} from "./client/client-list/client-list.component";
import {ClientReactivationComponent} from "./client/client-reactivation/client-reactivation.component";
import {ClientDetailComponent} from './client/client-detail/client-detail.component';
import {ClientEditComponent} from './client/client-edit/client-edit.component';
import {FormSelectComponent} from "./form/form-select/form-select.component";
import {ProfileComponent} from "../shared/account/profile/profile.component";
import {ClientAddFormComponent} from './client/client-add-form/client-add-form.component';
import {AboutComponent} from "./about/about.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";
import {FormDocComponent} from "./form/form-doc/form-doc.component";
import {ClientFinishComponent} from './client/client-finish/client-finish.component';
import {AuthGuard} from "../shared/guard/auth-guard";
import {AdminGuard} from "../shared/guard/admin-guard";
import { ClientPreviewComponent } from './client/client-preview/client-preview.component';

const pageRoutes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'about', component: AboutComponent},
      {path: 'contact_us', component: ContactUsComponent},
      {
        path: 'lawfirm',
        children: [
          {
            path: 'create',
            component: LawfirmCreateComponent,
            canActivate: [AdminGuard]
          },
          {path: 'profile', component: LawfirmProfileComponent},
          {
            path: 'user_assignment',
            children: [
              {path: '', component: LawfirmUserAssignmentComponent,},
              {path: 'detail/:id', component: LawfirmUserDetailComponent},
            ],
          },
          {
            path: 'license',
            component: LawfirmLicenseComponent,
            canActivate: [AdminGuard]
          },
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'client',
        children: [
          {path: 'create', component: ClientCreateComponent},
          {path: 'list', component: ClientListComponent},
          {path: 'edit/:id', component: ClientEditComponent},
          {path: 'addForm/:id', component: ClientAddFormComponent},
          { path: 'detail/:client_id/:form_id', component: ClientDetailComponent },
          { path: 'preview/:client_id/:form_id', component: ClientPreviewComponent },
          {path: 'reactivation', component: ClientReactivationComponent},
          {path: 'finish/:id', component: ClientFinishComponent},
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'form',
        children: [
          {path: 'select', component: FormSelectComponent},
          {path: 'doc', component: FormDocComponent},
        ],
        canActivate: [AuthGuard]
      },
      {
        path: 'account',
        children: [
          {path: 'profile', component: ProfileComponent},
        ],
        canActivate: [AuthGuard]
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(pageRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [],
  providers: [
    AuthGuard,
    AdminGuard
  ]
})
export class PagesRoutingModule {
}
