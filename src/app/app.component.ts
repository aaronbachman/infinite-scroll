import {Component} from '@angular/core';
import {WorkspaceService} from './state/workspace.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'infinite-scroll';

  constructor(
    private workspaceService: WorkspaceService,

  ) {
    // if (!this.workspaceQuery.getCount()) {
      this.workspaceService.initialLoad();

    // }
  }
}
