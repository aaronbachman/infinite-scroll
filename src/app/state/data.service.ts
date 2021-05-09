import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {Row} from './data.model';
import {delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  first = ['Great', 'Wonderful', 'Spectacular', 'Magnificent', 'Amazing'];
  second = ['Condo', 'House', 'Villa', 'Town Home'];
  third = ['Beach', 'Mountain', 'Ocean', 'River', 'Lake', 'City'];

  rows: number;

  constructor() {
  }

  totalRows$ = new Subject<number>();
  totalRows: number;

  rowLimit = 100;
  rowsPerPage = 25;

  initialLoad(): Observable<Row[]> {

    this.totalRows = this.getTotalRows();
    console.log(this.totalRows);
    this.totalRows$.next(this.totalRows);

    if (this.totalRows >= this.rowLimit) {
      this.rows = this.rowLimit;
    } else {
      this.rows = this.totalRows;
    }

    const data: Row[] = [];

    for (let i = 0; i < this.rows; i++) {
      data.push({id: i, name: '#' + i + ' ' + this.randomName(), isFirst: false, isLast: false});
    }
    return of(data).pipe(delay(2000));
  }

  getNextPage(page: number): Observable<Row[]> {
    if (this.totalRows <= this.rowLimit) {
      return;
    }

    const start = (page * this.rowsPerPage) + (this.rowLimit - this.rowsPerPage);
    const end = start + this.rowsPerPage;

    const data: Row[] = [];

    for (let i = start; i < end; i++) {
      data.push({id: i, name: '#' + i + ' ' + this.randomName(), isFirst: false, isLast: false});
    }
    return of(data).pipe(delay(2000));
  }


  getPreviousPage(page: number): Observable<Row[]> {
    const start = page * this.rowsPerPage;
    const end = start + this.rowsPerPage;

    const data: Row[] = [];

    for (let i = start; i < end; i++) {
      data.push({id: i, name: '#' + i + ' ' + this.randomName(), isFirst: false, isLast: false});
    }
    return of(data).pipe(delay(2000));
  }

  randomName(): string {
    const min = 0;
    const first = this.first[Math.floor(Math.random() * ((this.first.length - 1) - min + 1)) + min];
    const second = this.second[Math.floor(Math.random() * ((this.second.length - 1) - min + 1)) + min];
    const third = this.third[Math.floor(Math.random() * ((this.third.length - 1) - min + 1)) + min];
    return first + ' ' + second + ' with a ' + third + ' View';
  }

  getTotalRows(): number {
    return Math.floor(Math.random() * (2000 - 2) + 2);
  }
}
