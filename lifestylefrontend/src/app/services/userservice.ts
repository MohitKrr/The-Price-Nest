import { Injectable } from '@angular/core';
import { Component, inject } from '@angular/core';
import { User } from '../Models/user';
import { HttpClient , HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast-service';

@Injectable({
  providedIn: 'root' 
})
export class Userservice {
  
  users:Array<User> = [];
  client = inject(HttpClient);
  toastService = inject(ToastService);
  
  constructor(private router: Router) {
    // this.client.get<Array<User>>('http://localhost:5226/api/User').subscribe((data)=>{this.users = data;})
  }
  getUser():Array<User>
  {
  return this.users
  }

  registerNewUser(users:User)
  {
    this.client.post<User>('http://localhost:5226/api/User/register',users)
    .subscribe(
    {
      next:(data)=>{
        this.toastService.success('Registered successfully! Please login to continue.', 'Registration Success');
        this.users.push(users);
        this.router.navigate(['/login']); 
      },
      error:(error)=>{
        this.toastService.error('Registration failed. User may already exist.', 'Registration Error');
      }
    })
  }

  loginUser(users:User): Observable<any>
  {
    
    return this.client.post('http://localhost:5226/api/User/login', users);
    //   next: (data) => {alert('Login successful')},
    //   error: (error) => alert('Login failed: ' + JSON.stringify(error)),
    // });

  }

  passwordReset(users:User){

   // alert(JSON.stringify(users));
    this.client.post<User>('http://localhost:5226/api/User/reset_password',users)
    .subscribe(
    {
      next:(data)=>{
        this.toastService.success('Password reset successfully! Please check your email.', 'Password Reset Success');
        users = new User();              
        this.router.navigate(['/login']); 
      },
      error:(error)=>{
        this.toastService.error('Password reset failed. Please try again.', 'Password Reset Error');
      }
    });
  }

  // getUserProfileByEmail(email: string): Observable<UserProfile> {
  //   return this.client.get<UserProfile>(`http://localhost:5226/api/User/profile?email=${email}`);
  // }


  getUserByEmail(email: string): Observable<any> {
    return this.client.get(`http://localhost:5161/api/UserProfile/byEmail/${email}`);
  }

  updateUserProfile(email: string, profile: any): Observable<any> {
    return this.client.put(`http://localhost:5161/api/UserProfile/${email}`, profile);
  }
  
  
}
