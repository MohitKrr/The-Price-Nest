import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { User } from '../Models/user';
import { FormsModule } from '@angular/forms';
import { Userservice } from '../services/userservice';
import { ToastService } from '../services/toast-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
 users:User = new User();
  ns = inject(Userservice);
  toastService = inject(ToastService);

  RegisterHandler()
  {

      const email = this.users.email?.trim();
  const password = this.users.password?.trim();

  if (!email || !password) {
    this.toastService.warning('Email and Password are required.', 'Validation Error');
    return;
  }

   // alert(JSON.stringify(this.users))
     // this.client.post<User>('http://localhost:5226/api/User',this.users).subscribe((data)=>{alert('Registered Successfully')})
     
     this.ns.registerNewUser(this.users);
  }
}
