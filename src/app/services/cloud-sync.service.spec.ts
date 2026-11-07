import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { CloudSyncService, UserCareerStateDoc } from './cloud-sync.service';

describe('CloudSyncService', () => {
  let service: CloudSyncService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CloudSyncService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve user career data from Cloudflare API endpoint', async () => {
    const mockData: UserCareerStateDoc = {
      updatedAt: '2026-11-07T12:00:00.000Z',
      coursesByPlan: {},
      courseStates: {},
    };

    const promise = firstValueFrom(service.getUserCareerData$('user-123', 'sistemas'));
    const req = httpTesting.expectOne('/api/users/user-123/careers/sistemas');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    const result = await promise;
    expect(result).toEqual(mockData);
  });

  it('should handle HTTP error when getting user career data gracefully', async () => {
    const promise = firstValueFrom(service.getUserCareerData$('user-123', 'sistemas'));
    const req = httpTesting.expectOne('/api/users/user-123/careers/sistemas');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    const result = await promise;
    expect(result).toBeUndefined();
  });

  it('should check if cloud data exists via GET request', async () => {
    const promise = service.checkCloudDataExists('user-123', 'sistemas');
    const req = httpTesting.expectOne('/api/users/user-123/careers/sistemas');
    expect(req.request.method).toBe('GET');
    req.flush({ updatedAt: '2026-11-07' });

    const exists = await promise;
    expect(exists).toBe(true);
  });

  it('should save user career data to Cloudflare API endpoint', async () => {
    const promise = service.saveUserCareerData('user-123', 'sistemas', {
      courseStates: {},
    });

    const req = httpTesting.expectOne('/api/users/user-123/careers/sistemas');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.updatedAt).toBeTruthy();
    req.flush({ success: true });

    const saved = await promise;
    expect(saved).toBe(true);
  });
});
