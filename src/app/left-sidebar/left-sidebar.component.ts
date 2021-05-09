import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {DataService} from '../state/data.service';
import {Row} from '../state/data.model';

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
    private dataService: DataService,
    private renderer2: Renderer2
  ) {
  }

  rows: Row[];

  page = 0;
  previousId: string;
  totalRows: number;
  totalHeight: number;

  ngOnInit(): void {
    this.dataService.totalRows$.subscribe((totalRows: number) => {
      console.log('total rows: ' + totalRows);
      this.totalRows = totalRows;
      this.totalHeight = totalRows * 25;
    });

    this.dataService.initialLoad().subscribe((rows: Row[]) => {
      this.rows = rows;
      this.resetObservers();
      this.setInterval();
      this.setPadding();
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


  resetObservers(): void {
    this.rows.forEach((row: Row) => {
      row.isFirst = false;
      row.isLast = false;
    });
    if (this.page > 0) {
      this.rows[0].isFirst = true;
    }
    if (this.totalRows > this.rows.length) {
      this.rows[this.rows.length - 1].isLast = true;
    }
  }

  checkLastRow(): void {
    const config = {
      root: this.leftSidebarContainer.nativeElement,
      rootMargin: '0px',
      threshold: 0
    };
    const loadNextPage = new IntersectionObserver((e) => {
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
    const loadPreviousPage = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        this.previousId = e[0].target.id;
        loadPreviousPage.disconnect();
        this.loadPreviousPage();
      }
    }, config);
    loadPreviousPage.observe(this.firstRow.nativeElement);
  }

  loadNextPage(): void {
    this.page++;
    console.log('load next page: ' + this.page);
    this.dataService.getNextPage(this.page).subscribe((rows: Row[]) => {
      const newRow = this.rows.slice(25, this.rows.length);
      newRow.push(...rows);
      this.rows = newRow;
      this.resetObservers();
      this.setInterval();
      this.setPadding();
    });
  }

  setPadding(): void {
    this.renderer2.setStyle(this.paddingTop.nativeElement, 'height', this.page * 650 + 'px');
    this.renderer2.setStyle(this.paddingBottom.nativeElement, 'height', this.totalHeight - (this.page * 625) + 'px');
  }

  loadPreviousPage(): void {
    this.page--;
    if (this.page >= 0) {
      console.log('load previous page: ' + this.page);
      this.dataService.getPreviousPage(this.page).subscribe((rows: Row[]) => {
        const slicedRows = this.rows.slice(0, 75);
        const newRow = rows;
        newRow.push(...slicedRows);
        this.rows = newRow;
        this.resetObservers();
        this.setInterval();
        this.setPadding();
      });
    } else {
      this.page = 0;
    }
  }
}
