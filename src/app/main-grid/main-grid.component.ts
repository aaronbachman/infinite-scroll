import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {WorkspaceService} from '../state/workspace.service';
import {Workspace} from '../state/workspace.model';
import {WorkspaceQuery} from '../state/workspace.query';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-main-grid',
  templateUrl: './main-grid.component.html',
  styleUrls: ['./main-grid.component.css']
})
export class MainGridComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('paddingTop') paddingTop: ElementRef;
  @ViewChild('paddingBottom') paddingBottom: ElementRef;
  @ViewChild('table') table: ElementRef;

  workspace: Workspace;
  subscription: Subscription = new Subscription();

  constructor(
    private workspaceService: WorkspaceService,
    private renderer2: Renderer2,
    public workspaceQuery: WorkspaceQuery,
  ) {
  }


  ngAfterViewInit(): void {
    this.renderer2.listen(this.table.nativeElement, 'scroll', (e) => {
      this.workspaceService.scrollTop$.next((e.target as Element).scrollTop);
    });
  }

  ngOnInit(): void {
    this.subscription.add(this.workspaceQuery.selectLoading().subscribe((loading: boolean) => {
      if (this.table) {
        if (loading) {
          this.renderer2.setStyle(this.table.nativeElement, 'overflow-y', 'hidden');
        } else {
          this.renderer2.setStyle(this.table.nativeElement, 'overflow-y', 'scroll');
        }
      }
    }));

    this.subscription.add(this.workspaceService.activeWorkspace$.subscribe((workspace: Workspace) => {
      this.workspace = workspace;
      if (workspace.rows.length) {
        this.setPadding();
      }
    }));
  }

  setPadding(): void {
    if (this.paddingTop) {
      this.renderer2.setStyle(this.paddingTop.nativeElement, 'height', (this.workspace.page * 648) + 'px');
    }
    if (this.paddingBottom) {
      let height = this.workspace.totalRows * 25;
      height = (height - (this.workspace.page * 625));
      if (this.workspace.lastPage) {
        height = 0;
      }
      this.renderer2.setStyle(this.paddingBottom.nativeElement, 'height', height + 'px');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
