import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<ToastMessage[]>([]);
  private nextId = 1;

  get toasts$() {
    return this.toasts.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', title?: string, duration: number = 5000) {
    const toast: ToastMessage = {
      id: this.nextId++,
      type,
      message,
      title,
      duration
    };

    const currentToasts = this.toasts.value;
    this.toasts.next([...currentToasts, toast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }

    return toast.id;
  }

  success(message: string, title?: string, duration?: number) {
    return this.show(message, 'success', title, duration);
  }

  error(message: string, title?: string, duration?: number) {
    return this.show(message, 'error', title, duration);
  }

  warning(message: string, title?: string, duration?: number) {
    return this.show(message, 'warning', title, duration);
  }

  info(message: string, title?: string, duration?: number) {
    return this.show(message, 'info', title, duration);
  }

  remove(id: number) {
    const currentToasts = this.toasts.value;
    this.toasts.next(currentToasts.filter(toast => toast.id !== id));
  }

  clear() {
    this.toasts.next([]);
  }
} 