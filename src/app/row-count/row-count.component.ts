import {Component, OnInit} from '@angular/core';
import {WorkspaceService} from '../state/workspace.service';

@Component({
  selector: 'app-row-count',
  templateUrl: './row-count.component.html',
  styleUrls: ['./row-count.component.css']
})
export class RowCountComponent implements OnInit {

  workspace = this.workspaceService.activeWorkspace$;

  constructor(private workspaceService: WorkspaceService) {
  }

  ngOnInit(): void {
  }

}
