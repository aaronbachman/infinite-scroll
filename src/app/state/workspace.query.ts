import { QueryEntity } from '@datorama/akita';
import {Injectable} from '@angular/core';
import {WorkspaceState, WorkspaceStore} from './workspace.store';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceQuery extends QueryEntity<WorkspaceState> {
  constructor(protected store: WorkspaceStore) {
    super(store);
  }
}
