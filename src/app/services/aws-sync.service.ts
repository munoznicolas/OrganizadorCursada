import { Injectable } from '@angular/core';
import { CloudSyncService, UserCareerStateDoc } from './cloud-sync.service';

export type { UserCareerStateDoc };

@Injectable({
  providedIn: 'root',
})
export class AwsSyncService extends CloudSyncService {}
