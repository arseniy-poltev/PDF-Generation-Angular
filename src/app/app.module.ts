import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppRoutingModule} from "./app-routing.module";
import {PagesModule} from "./pages/pages.module";
import {SharedModule} from "./shared/shared.module";
import {AdminModule} from "./pages/admin/admin.module";
import {AppComponent} from './app.component';
import {Router} from "@angular/router";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    PagesModule,
    SharedModule,
    AdminModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
