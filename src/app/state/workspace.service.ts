import {Injectable, OnDestroy} from '@angular/core';
import {Column, Workspace} from './workspace.model';
import {WorkspaceStore} from './workspace.store';
import {WorkspaceQuery} from './workspace.query';
import {BehaviorSubject, Subscription} from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService implements OnDestroy {

  workspace: Workspace = {
    id: 1,
    isActive: true,
    page: 0,
    totalRows: 0,
    rows: [],
    scrollTop: 0
  };

  activeWorkspace$ = new BehaviorSubject<Workspace>(this.workspace);
  rowLimit = 100;
  rowsPerPage = 25;
  lastPage: number;
  subscription: Subscription = new Subscription();
  isLast = false;
  remaining = 0;
  scrollTop$ = new BehaviorSubject<number>(0);

  constructor(
    private workspaceStore: WorkspaceStore,
    private workspaceQuery: WorkspaceQuery
  ) {

    this.subscription.add(this.activeWorkspace$.subscribe((workspace: Workspace) => {
      this.workspace = workspace;
    }));
  }

  initialLoad(): void {
    // This is a random number of rows
    this.workspace.totalRows = this.getTotalRows();
    if (this.workspace.totalRows < this.rowLimit) {
      this.lastPage = 0;
    } else {
      this.lastPage = Math.floor((this.workspace.totalRows - this.rowLimit) / this.rowsPerPage);
      this.remaining = this.workspace.totalRows - (this.rowLimit + (this.rowsPerPage * this.lastPage));
    }

    if (this.workspace.totalRows <= this.rowLimit) {
      this.rowLimit = this.workspace.totalRows;
    }

    this.workspace.rows = [];
    this.workspace.columns = this.getColumns();
    for (let i = 0; i <= this.rowLimit; i++) {
      this.workspace.rows.push({id: i, name: 'Row #' + (i + 1)});
    }

    // Using timeout just to mock the server response of 2 seconds.
    setTimeout(() => {
      this.workspaceStore.add(this.workspace);
      this.workspaceStore.setActive(this.workspace.id);
      this.activeWorkspace$.next(this.workspace);
    }, 1000);
  }

  getNextPage(): boolean {
    if (this.isLast) {
      return false;
    }

    let isLast = false;
    if ((this.workspace.page) === this.lastPage) {
      isLast = true;
      this.isLast = true;
    }

    this.workspaceStore.setLoading(true);
    const newPage = this.workspace.page + 1;
    this.workspaceStore.updateActive({page: newPage});
    const start = (newPage * this.rowsPerPage) + (this.rowLimit - this.rowsPerPage);
    let end = start + this.rowsPerPage;
    if (isLast && this.remaining) {
      end = start + this.remaining;
    }
    const rows = this.workspace.rows.slice(25, this.workspace.rows.length);
    for (let i = start; i <= end; i++) {
      rows.push({id: i, name: 'Row #' + i});
    }

    setTimeout(() => {
      this.workspaceStore.updateActive({rows});
      this.activeWorkspace$.next(this.workspaceQuery.getEntity(this.workspace.id));
      this.workspaceStore.setLoading(false);
    }, 1000);
    return true;
  }

  getPreviousPage(): void {
    const newPage = this.workspace.page - 1;
    if (newPage < 0) {
      return;
    }
    this.isLast = false;
    this.workspaceStore.setLoading(true);
    this.workspaceStore.updateActive({page: newPage});
    const start = newPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    const slicedRows = this.workspace.rows.slice(0, 75);
    const rows = [];
    for (let i = start; i <= end; i++) {
      rows.push({id: i, name: 'Row #' + i});
    }
    rows.push(...slicedRows);
    setTimeout(() => {
      this.workspaceStore.updateActive({rows});
      this.activeWorkspace$.next(this.workspaceQuery.getEntity(this.workspace.id));
      this.workspaceStore.setLoading(false);
    }, 1000);
  }

  // Number of rows can change depending on user input so this mocks it be returning a random number of rows
  getTotalRows(min: number = 100, max: number = 300): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getColumns(): Column[] {
    const columns: Column[] = [];
    const date = moment().subtract(10, 'days');
    let count = 0;

    while (count < 250) {
      const formattedDate = date.format('YYYY-MM-DD');
      columns.push({date: formattedDate});
      date.add(1, 'day');
      count++;
    }
    return columns;
  }

  scrollTop(v: number): void {
    this.scrollTop$.next(v);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
