export interface Workspace {
  id: number;
  isActive: boolean;
  scrollTop: number;
  rows: Row[];
  columns?: Column[];
  totalRows: number;
  page: number;
  lastPage: boolean;
}

export interface Row {
  id: number;
  name: string;
}

export interface Column {
  date: string;
}
