import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Userservice } from '../../services/userservice';
import { AuthService } from '../../services/auth-service';
import { LifestyleModel } from '../Models/lifestyle-model';
import { LifestyleService } from '../services/lifestyle-service';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  profileForm!: FormGroup;
  client = inject(Userservice);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  toastService = inject(ToastService);
    lifestyles: Array<LifestyleModel> = [];
  os = inject(LifestyleService);
  originalProfile: any;

 // countries: Array<{ id: string, name: string }> = [];
 constructor(private router: Router) {
   
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      age: [''],
      gender: [''],
      salary: [''],
      presentLivingCountry: ['']
    });

    const email = this.authService.getEmailFromToken();
    if (email) {
      this.client.getUserByEmail(email).subscribe(profile => {
        this.profileForm.patchValue(profile);
        this.originalProfile = { ...profile };
      });
    }

    // Fetch countries from Lifestyle service
    // this.http.get<any[]>('http://localhost:5209/api/lifestyle').subscribe(data => {
    //   this.countries = data;
    // });
    // this.lifestyles = this.os.getLifeStyles();

    this.os.getAll().subscribe(data => {
      this.lifestyles = data;
        // Now patch profile form once countries are loaded
        const email = this.authService.getEmailFromToken();
        if (email) {
          this.client.getUserByEmail(email).subscribe(profile => {
            // Patch the country name as is
            this.profileForm.patchValue(profile);
          });
        }
      });
    
  }

  save(): void {
    const email = this.authService.getEmailFromToken();
    if (email) {
      const updatedProfile = this.profileForm.value;

      const hasChanges = Object.keys(updatedProfile).some(
        key => updatedProfile[key] !== this.originalProfile[key]
      );
  
      if (!hasChanges) {
        this.toastService.info('No changes detected in your profile.', 'No Changes');
        return;
      }
      
      // If country is name, convert to ID if needed
      // const selectedCountry = this.lifestyles.find(c => c.countryName === updatedProfile.presentLivingCountry);
      // if (selectedCountry) {
      //   updatedProfile.presentLivingCountry = selectedCountry.id;
      // }

      this.client.updateUserProfile(email, updatedProfile).subscribe({
        next: () => {
          this.toastService.success('Profile updated successfully!', 'Profile Updated');
          this.originalProfile = { ...updatedProfile };
        },
        error: () => {
          this.toastService.error('Failed to update profile. Please try again.', 'Update Error');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  showPassword = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}


}
