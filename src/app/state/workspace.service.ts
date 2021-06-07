import {Injectable} from '@angular/core';
import {Workspace} from './workspace.model';
import {WorkspaceStore} from './workspace.store';
import {WorkspaceQuery} from './workspace.query';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  workspace: Workspace = {
    id: 1,
    isActive: true,
    page: 0,
    totalRows: 0,
    rows: [],
  };

  activeWorkspace$ = new BehaviorSubject<Workspace>(this.workspace);

  constructor(
    private workspaceStore: WorkspaceStore,
    private workspaceQuery: WorkspaceQuery
  ) {

    this.activeWorkspace$.subscribe((workspace: Workspace) => {
      this.workspace = workspace;
    });
  }


  rowLimit = 100;
  rowsPerPage = 25;

  initialLoad(): void {
    // This is a random number of rows
    this.workspace.totalRows = this.getTotalRows();

    if (this.workspace.totalRows >= this.rowLimit) {
      this.workspace.totalRows = this.rowLimit;
    }

    this.workspace.rows = [];

    for (let i = 0; i < this.workspace.totalRows; i++) {
      this.workspace.rows.push({id: i, name: 'Row #' + i});
    }

    // Using timeout just to mock the server response of 2 seconds.
    setTimeout(() => {
      this.workspaceStore.add(this.workspace);
      this.workspaceStore.setActive(this.workspace.id);
      this.activeWorkspace$.next(this.workspace);
    }, 2000);
  }

  getNextPage(): void {
    if (this.workspace.totalRows < this.rowLimit) {
      return;
    }
    this.workspaceStore.setLoading(true);
    const newPage = this.workspace.page + 1;
    this.workspaceStore.updateActive({page: newPage});
    const start = (newPage * this.rowsPerPage) + (this.rowLimit - this.rowsPerPage);
    const end = start + this.rowsPerPage;

    const rows = this.workspace.rows.slice(25, this.workspace.rows.length);
    for (let i = start; i < end; i++) {
      rows.push({id: i, name: 'Row #' + i});
    }

    setTimeout(() => {
      this.workspaceStore.updateActive({rows});
      this.activeWorkspace$.next(this.workspaceQuery.getEntity(this.workspace.id));
      this.workspaceStore.setLoading(false);
    }, 2000);
  }

  getPreviousPage(): void {
    const newPage = this.workspace.page - 1;
    if (newPage < 0) {
      return;
    }
    this.workspaceStore.setLoading(true);
    this.workspaceStore.updateActive({page: newPage});
    const start = newPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    const slicedRows = this.workspace.rows.slice(0, 75);
    const rows = [];
    for (let i = start; i < end; i++) {
      rows.push({id: i, name: 'Row #' + i});
    }
    rows.push(...slicedRows);
    setTimeout(() => {
      this.workspaceStore.updateActive({rows});
      this.activeWorkspace$.next(this.workspaceQuery.getEntity(this.workspace.id));
      this.workspaceStore.setLoading(false);
    }, 2000);
  }

  getTotalRows(): number {
    return Math.floor(Math.random() * (2000 - 2) + 2);
  }
}
