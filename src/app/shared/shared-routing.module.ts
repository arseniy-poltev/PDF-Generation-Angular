import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { SharedComponent } from './shared.component';
import { NotFoundComponent } from './not-found/not-found.component';


const pageRoutes: Routes = [
  {
    path: 'shared',
    component: SharedComponent,
    children: [
      { path: 'not_found', component: NotFoundComponent },
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
})
export class SharedRoutingModule { }
