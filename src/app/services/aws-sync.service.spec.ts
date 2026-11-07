import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AwsSyncService } from './aws-sync.service';

describe('AwsSyncService', () => {
  let service: AwsSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AwsSyncService);
  });

  it('should be created as a backward-compatible adapter', () => {
    expect(service).toBeTruthy();
  });
});
