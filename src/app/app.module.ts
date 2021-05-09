import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DateHeaderComponent } from './date-header/date-header.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { MainGridComponent } from './main-grid/main-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    DateHeaderComponent,
    LeftSidebarComponent,
    MainGridComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
