export interface Workspace {
  id: number;
  isActive: boolean;
  rows: Rows[];
  totalRows: number;
  page: number;
}

export interface Rows {
  id: number;
  name: string;
  columns?: Columns[];
}

export interface Columns {
  id: number;
  date: string;
  upperLabel: string;
  lowerLabel: string;
}
