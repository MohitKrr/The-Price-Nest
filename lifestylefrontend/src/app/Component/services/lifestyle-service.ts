import { inject, Injectable } from '@angular/core';
import { LifestyleModel } from '../Models/lifestyle-model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LifestyleService {
  client = inject(HttpClient)
    lifestyles: Array<LifestyleModel> = []
 
    constructor() {
        this.client.get<Array<LifestyleModel>>('http://localhost:5209/api/LifeStyle')
            .subscribe((data) => {
                this.lifestyles = data;
            })
    }
    getAll(): Observable<Array<LifestyleModel>> {
      return this.client.get<Array<LifestyleModel>>('http://localhost:5209/api/LifeStyle');
    }    
    getFavourite(): Array<LifestyleModel> {
        return this.lifestyles;
    }
}
