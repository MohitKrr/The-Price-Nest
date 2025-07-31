import { Component, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { User } from '../Models/user';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Userservice } from '../services/userservice';
import { AuthService } from '../services/auth-service';
import { ToastService } from '../services/toast-service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, HttpClientModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  users: User = new User();
  client = inject(Userservice);
  authService = inject(AuthService);
  router = inject(Router);
  toastService = inject(ToastService);

  LoginHandler() {
    const email = this.users.email?.trim();
    const password = this.users.password?.trim();

    if (!email || !password) {
      this.toastService.warning('Email and password are required.', 'Validation Error');
      return;
    }

    this.client.loginUser(this.users).subscribe({
      next: (response: any) => {
        if (response.status === 'success' && response.token) {
          localStorage.setItem('token', response.token);
          this.authService.login(response.token);
          this.toastService.success('Login successful! Welcome back!', 'Success');
          this.router.navigate(['/']);
        } else {
          this.toastService.error('Login failed. Please check your credentials.', 'Login Error');
        }
      },
      error: (err) => {
        this.toastService.error('Invalid credentials. Please try again.', 'Login Error');
      }
    });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
