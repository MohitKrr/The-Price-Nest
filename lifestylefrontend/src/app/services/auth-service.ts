import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';

  private authDataSubject = new BehaviorSubject<{
    isLoggedIn: boolean,
    email: string | null
  }>({
    isLoggedIn: !!localStorage.getItem(this.TOKEN_KEY),
    email: AuthService.extractEmailFromToken(localStorage.getItem(this.TOKEN_KEY))
  });

  authData$ = this.authDataSubject.asObservable();

  login(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);

    this.authDataSubject.next({
      isLoggedIn: true,
      email: this.getEmailFromToken()
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);

    this.authDataSubject.next({ isLoggedIn: false, email: null });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getEmailFromToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return AuthService.extractEmailFromToken(token);
  }

  getDecodedToken(): any | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return AuthService.decodeJwt(token);
  }

  // Static helpers for decoding JWT
  static decodeJwt(token: string | null): any | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  static extractEmailFromToken(token: string | null): string | null {
    const decoded = AuthService.decodeJwt(token);
    return decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null;
  }
}
