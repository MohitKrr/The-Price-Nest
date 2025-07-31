import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../Models/user';
import { FormsModule } from '@angular/forms';
import { Userservice } from '../services/userservice';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastService } from '../services/toast-service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  constructor(private router: Router) {}
  
  navigateToLogin()
  {
    this.router.navigate(['/login']);
  }

  users: User = new User();
  client = inject(Userservice);
  toastService = inject(ToastService);

  forgotPassword() {
    const email = this.users.email?.trim();

    if (!email) {
      this.toastService.warning('Email is required to reset your password.', 'Validation Error');
      return;
    }

    this.client.passwordReset(this.users);
  }
}
