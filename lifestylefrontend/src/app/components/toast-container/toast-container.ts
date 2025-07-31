import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
      <div *ngFor="let toast of toasts" 
           class="toast show" 
           role="alert" 
           aria-live="assertive" 
           aria-atomic="true"
           [ngClass]="getToastClass(toast.type)">
        <div class="toast-header">
          <i [class]="getIconClass(toast.type)" class="me-2"></i>
          <strong class="me-auto">{{ toast.title || getDefaultTitle(toast.type) }}</strong>
          <button type="button" class="btn-close" (click)="removeToast(toast.id)" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      max-width: 350px;
    }
    
    .toast {
      margin-bottom: 0.5rem;
      border: none;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .toast-success {
      background-color: #d4edda;
      border-left: 4px solid #28a745;
    }
    
    .toast-error {
      background-color: #f8d7da;
      border-left: 4px solid #dc3545;
    }
    
    .toast-warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
    }
    
    .toast-info {
      background-color: #d1ecf1;
      border-left: 4px solid #17a2b8;
    }
    
    .toast-header {
      background-color: transparent;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .toast-body {
      padding: 0.75rem;
    }
  `]
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastMessage[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeToast(id: number) {
    this.toastService.remove(id);
  }

  getToastClass(type: string): string {
    return `toast-${type}`;
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-success';
      case 'error':
        return 'fas fa-exclamation-circle text-danger';
      case 'warning':
        return 'fas fa-exclamation-triangle text-warning';
      case 'info':
        return 'fas fa-info-circle text-info';
      default:
        return 'fas fa-info-circle text-info';
    }
  }

  getDefaultTitle(type: string): string {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Information';
      default:
        return 'Notification';
    }
  }
} 