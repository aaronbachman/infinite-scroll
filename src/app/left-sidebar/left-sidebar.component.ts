import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {WorkspaceService} from '../state/workspace.service';
import {Workspace} from '../state/workspace.model';
import {WorkspaceQuery} from '../state/workspace.query';
import {WorkspaceStore} from '../state/workspace.store';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {

  @ViewChild('leftSidebarContainer') leftSidebarContainer: ElementRef;
  @ViewChild('firstRow') firstRow: ElementRef;
  @ViewChild('lastRow') lastRow: ElementRef;
  @ViewChild('paddingTop') paddingTop: ElementRef;
  @ViewChild('paddingBottom') paddingBottom: ElementRef;

  constructor(
    private workspaceService: WorkspaceService,
    private workspaceQuery: WorkspaceQuery,
    private workspaceStore: WorkspaceStore,
    private renderer2: Renderer2
  ) {
  }

  workspace: Workspace;
  previousId: string;
  totalHeight: number;
  firstRowId: number;
  lastRowId: number;
  loading: boolean;

  ngOnInit(): void {
    this.workspaceQuery.selectLoading().subscribe((loading: boolean) => {
      this.loading = loading;
      if (this.leftSidebarContainer) {
        if (loading) {
          this.renderer2.setStyle(this.leftSidebarContainer.nativeElement, 'overflow-y', 'hidden');
        } else {
          this.renderer2.setStyle(this.leftSidebarContainer.nativeElement, 'overflow-y', 'scroll');
        }
      }
    });

    this.workspaceService.activeWorkspace$.subscribe((workspace: Workspace) => {
      if (workspace.rows.length) {
        this.totalHeight = workspace.totalRows * 25;
        if (workspace.page > 0) {
          this.firstRowId = workspace.rows[0].id;
        }
        this.lastRowId = workspace.rows[workspace.rows.length - 1].id;
        this.workspace = workspace;
        this.setPadding();
        setTimeout(() => {
          this.setInterval();
        }, 500);
      }
    });
  }

  setInterval(): void {
    const firstRowInterval = setInterval(() => {
      if (this.firstRow) {
        this.checkFirstRow();
        clearInterval(firstRowInterval);
      }
    }, 100);

    const lastRowInterval = setInterval(() => {
      if (this.lastRow) {
        this.checkLastRow();
        clearInterval(lastRowInterval);
      }
    }, 100);
  }

  checkLastRow(): void {
    const config = {
      root: this.leftSidebarContainer.nativeElement,
      rootMargin: '0px',
      threshold: 0
    };
    const loadNextPage = new IntersectionObserver((e: IntersectionObserverEntry[]) => {
      if (e[0].isIntersecting) {
        loadNextPage.disconnect();
        this.loadNextPage();
      }
    }, config);
    loadNextPage.observe(this.lastRow.nativeElement);
  }

  checkFirstRow(): void {
    const config = {
      root: this.leftSidebarContainer.nativeElement,
      rootMargin: '0px',
      threshold: 0
    };
    const loadPreviousPage = new IntersectionObserver((e: IntersectionObserverEntry[]) => {
      if (e[0].isIntersecting) {
        this.previousId = e[0].target.id;
        loadPreviousPage.disconnect();
        this.loadPreviousPage();
      }
    }, config);
    loadPreviousPage.observe(this.firstRow.nativeElement);
  }

  loadNextPage(): void {
    this.workspaceService.getNextPage();
  }

  setPadding(): void {
    if (this.paddingTop) {
      this.renderer2.setStyle(this.paddingTop.nativeElement, 'height', (this.workspace.page * 650) + 'px');
    }
    if (this.paddingBottom) {
      this.renderer2.setStyle(this.paddingBottom.nativeElement, 'height', (this.totalHeight - (this.workspace.page * 625)) + 'px');
    }
  }

  loadPreviousPage(): void {
    this.workspaceService.getPreviousPage();
  }
}
