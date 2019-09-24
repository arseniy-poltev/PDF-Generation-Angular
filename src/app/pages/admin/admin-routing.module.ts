import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AdminComponent} from "./admin.component";
import {AdminUserComponent} from "./admin-user/admin-user.component";
import {AdminFormComponent} from "./admin-form/admin-form.component";
import {AdminFormSchemaComponent} from "./admin-form/admin-form-schema/admin-form-schema.component";
import {AuthGuard} from "../../shared/guard/auth-guard";
import {AdminLawfirmComponent} from "./admin-lawfirm/admin-lawfirm.component";
import { SuperAdminGuard } from 'app/shared/guard/super-admin-guard';

const pageRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'user', component: AdminUserComponent, canActivate: [SuperAdminGuard]},
      { path: 'lawfirm', component: AdminLawfirmComponent, canActivate: [SuperAdminGuard] },
      {
        path: 'form',
        children: [
          {path: 'main', component: AdminFormComponent},
          {path: 'schema', component: AdminFormSchemaComponent},
        ],
        canActivate: [SuperAdminGuard]
      },
    ],
    canActivate: [AuthGuard]
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
  providers: [AuthGuard, SuperAdminGuard]
})
export class AdminRoutingModule {
}
