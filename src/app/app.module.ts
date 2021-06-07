import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DateHeaderComponent } from './date-header/date-header.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { MainGridComponent } from './main-grid/main-grid.component';
import {WorkspaceQuery} from './state/workspace.query';
import {WorkspaceStore} from './state/workspace.store';
import {WorkspaceService} from './state/workspace.service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    DateHeaderComponent,
    LeftSidebarComponent,
    MainGridComponent
  ],
  imports: [
    BrowserModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
  ],
  providers: [
    WorkspaceQuery,
    WorkspaceStore,
    WorkspaceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
