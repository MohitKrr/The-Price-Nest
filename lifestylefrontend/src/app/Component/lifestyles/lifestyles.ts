import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LifestyleModel } from '../Models/lifestyle-model';
import { LifestyleService } from '../services/lifestyle-service';

@Component({
  selector: 'app-lifestyles',
  imports: [HttpClientModule],
  templateUrl: './lifestyles.html',
  styleUrl: './lifestyles.css'
})
export class Lifestyles {
  lifestyles: Array<LifestyleModel> = [];
  os = inject(LifestyleService);
  isEdit: boolean = false;

  constructor(private router: Router) {
    this.lifestyles = this.os.getFavourite();
  }
}
