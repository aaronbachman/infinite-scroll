import {AfterViewChecked, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {WorkspaceService} from '../state/workspace.service';

@Component({
  selector: 'app-main-grid',
  templateUrl: './main-grid.component.html',
  styleUrls: ['./main-grid.component.css']
})
export class MainGridComponent implements OnInit, OnDestroy {


  @ViewChild('table') table: ElementRef;
  listener;

  workspace = this.workspaceService.activeWorkspace$;

  constructor(
    private workspaceService: WorkspaceService,
    private renderer2: Renderer2,
    private ngZone: NgZone
  ) {
    const scrollInterval = setInterval(() => {
      if (this.table && this.table.nativeElement) {
        this.listener = this.renderer2.listen(this.table.nativeElement, 'scroll', (e) => {
          const scrollTop = this.getYPosition(e);
          this.workspaceService.scrollTop$.next(scrollTop);
        });
        clearInterval(scrollInterval);
      }
    }, 100);
  }

  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }

  ngOnInit(): void {


  }

  ngOnDestroy(): void {
    this.listener();
  }

  scroll(): void {
    console.log(this.table.nativeElement.scrollTop);
    // this.workspaceService.scrollTop(this.table.nativeElement.scrollTop);
    // this.workspaceService.setScrollTop(this.table.nativeElement.scrollTop);
  }
}
