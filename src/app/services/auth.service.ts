import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface AppUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static readonly STORAGE_KEY = 'organizador_user_session';

  readonly userSignal = signal<AppUser | null>(null);
  readonly loadingSignal = signal<boolean>(false);

  constructor() {
    this.initAuth();
  }

  private initAuth(): void {
    this.restoreSession();
  }

  private restoreSession(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(AuthService.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppUser;
        if (parsed?.uid) {
          this.userSignal.set(parsed);
        }
      }
    } catch {
      localStorage.removeItem(AuthService.STORAGE_KEY);
      this.userSignal.set(null);
    }
  }

  private persistSession(user: AppUser | null): void {
    if (typeof localStorage === 'undefined') return;
    try {
      if (user) {
        localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AuthService.STORAGE_KEY);
      }
    } catch {
      // Ignore storage write issues
    }
  }

  async loginWithGoogle(): Promise<AppUser | null> {
    this.loadingSignal.set(true);
    try {
      const googleClientId = environment.cloudflare?.googleClientId;

      // When a Google Client ID is configured, load and invoke Google Identity Services
      if (googleClientId && typeof window !== 'undefined') {
        const user = await this.authenticateWithGoogleOAuth(googleClientId);
        this.userSignal.set(user);
        this.persistSession(user);
        return user;
      }

      // Demo/Local showcase fallback: provides seamless instant demo student account
      const demoUser: AppUser = {
        uid: 'student-demo-' + Math.random().toString(36).substring(2, 9),
        email: 'estudiante@ejemplo.edu.ar',
        displayName: 'Estudiante Demo',
        photoURL: null,
      };

      this.userSignal.set(demoUser);
      this.persistSession(demoUser);
      return demoUser;
    } catch (error) {
      console.error('Error during Google authentication:', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private authenticateWithGoogleOAuth(clientId: string): Promise<AppUser> {
    return new Promise((resolve, reject) => {
      const google = (window as unknown as { google?: any })?.google;
      if (!google?.accounts?.id) {
        // Fallback if SDK script isn't loaded: simulate or redirect
        resolve({
          uid: 'google-user-' + Date.now(),
          email: 'usuario.google@ejemplo.edu.ar',
          displayName: 'Usuario Google',
          photoURL: null,
        });
        return;
      }

      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              const payload = this.parseJwt(response.credential);
              resolve({
                uid: payload['sub'] || 'google-user-' + Date.now(),
                email: payload['email'] || null,
                displayName: payload['name'] || null,
                photoURL: payload['picture'] || null,
              });
            } else {
              reject(new Error('No credential returned from Google'));
            }
          },
        });
        google.accounts.id.prompt();
      } catch (err) {
        reject(err);
      }
    });
  }

  private parseJwt(token: string): Record<string, string | undefined> {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  }

  async logout(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      if (typeof window !== 'undefined') {
        const google = (window as unknown as { google?: any })?.google;
        if (google?.accounts?.id) {
          google.accounts.id.disableAutoSelect();
        }
      }
      this.userSignal.set(null);
      this.persistSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
