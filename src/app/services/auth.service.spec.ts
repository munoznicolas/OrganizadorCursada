import { TestBed } from '@angular/core/testing';
import { AuthService, AppUser } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockStore: Record<string, string> = {};

  const mockLocalStorage = {
    getItem: (key: string) => mockStore[key] ?? null,
    setItem: (key: string, value: string) => {
      mockStore[key] = value;
    },
    removeItem: (key: string) => {
      delete mockStore[key];
    },
    clear: () => {
      mockStore = {};
    },
  };

  beforeAll(() => {
    try {
      Object.defineProperty(globalThis, 'localStorage', {
        value: mockLocalStorage,
        writable: true,
        configurable: true,
      });
    } catch {}
  });

  beforeEach(() => {
    mockStore = {};
    try {
      if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.clear === 'function') {
        localStorage.clear();
      }
    } catch {}

    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    try {
      if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.clear === 'function') {
        localStorage.clear();
      }
    } catch {}
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize userSignal to null by default when user is unauthenticated', () => {
    expect(service.userSignal()).toBeNull();
    expect(service.loadingSignal()).toBe(false);
  });

  it('should restore existing session from localStorage upon initialization', () => {
    const existingUser: AppUser = {
      uid: 'saved-user-123',
      email: 'test@ejemplo.edu.ar',
      displayName: 'Test User',
      photoURL: null,
    };
    mockStore['organizador_user_session'] = JSON.stringify(existingUser);

    const restoredService = TestBed.runInInjectionContext(() => new AuthService());
    expect(restoredService.userSignal()).toEqual(existingUser);
  });

  it('should handle corrupted session in localStorage gracefully', () => {
    mockStore['organizador_user_session'] = '{ invalid json ...';
    const restoredService = TestBed.runInInjectionContext(() => new AuthService());
    expect(restoredService.userSignal()).toBeNull();
  });

  it('should successfully log in with demo fallback when no googleClientId is configured', async () => {
    const user = await service.loginWithGoogle();
    expect(user).toBeTruthy();
    expect(user?.displayName).toBe('Estudiante Demo');
    expect(service.userSignal()).toEqual(user);
    expect(service.loadingSignal()).toBe(false);
    expect(mockStore['organizador_user_session']).toBeTruthy();
  });

  it('should clear user signal and storage on logout', async () => {
    await service.loginWithGoogle();
    expect(service.userSignal()).not.toBeNull();

    await service.logout();
    expect(service.userSignal()).toBeNull();
    expect(service.loadingSignal()).toBe(false);
    expect(mockStore['organizador_user_session']).toBeFalsy();
  });
});
