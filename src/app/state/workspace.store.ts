import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Injectable} from '@angular/core';
import {Workspace} from './workspace.model';

export interface WorkspaceState extends EntityState<Workspace, number> {
}

@Injectable()
@StoreConfig({
  name: 'workspace', idKey: 'id', cache: {
    ttl: 1800000 // 30 minutes
  }
})

export class WorkspaceStore extends EntityStore<WorkspaceState> {
  constructor() {
    super();
  }
}
