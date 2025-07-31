import { Component, inject, OnDestroy } from '@angular/core';
import { LifestyleModel } from '../Models/lifestyle-model';
import { LifestyleService } from '../services/lifestyle-service';
import { Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CountryCard } from '../country-card/country-card';
import { FavouriteService } from '../services/favourite-service';
import { AuthService } from '../../services/auth-service';
import { FavouriteModel } from '../Models/favourite-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-countries',
  imports: [HttpClientModule, CountryCard],
  templateUrl: './countries.html',
  styleUrl: './countries.css'
})

export class Countries implements OnDestroy {
  lifestyles: Array<LifestyleModel> = [];
  userFavouriteNames: string[] = [];
  os = inject(LifestyleService);
  favouriteService = inject(FavouriteService);
  authService = inject(AuthService);
  username: string | null = null;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router) {
    this.os.getAll().subscribe((data) => {
      this.lifestyles = data;
    });
    
    this.authService.authData$.subscribe(data => {
      this.username = data.email; // Use email as username
      if (this.username) {
        this.loadUserFavourites();
      } else {
        this.userFavouriteNames = [];
      }
    });

    // Listen for favourites updates
    this.subscriptions.push(
      this.favouriteService.favouritesUpdated$.subscribe(() => {
        if (this.username) {
          this.loadUserFavourites();
        }
      })
    );
  }

  private loadUserFavourites() {
    if (!this.username) return;
    
    this.favouriteService.getFavouritesByUsername(this.username).subscribe(favs => {
      this.userFavouriteNames = favs.map(f => f.countryname || '');
    });
  }

  mapToCardModel(l: LifestyleModel) {
    return {
      name: l.countryName,
      abbr: l.countryName.slice(0, 3).toUpperCase(), // Just an example, change if needed
      rank: l.globalRank,
      avgCost: l.averageCostOfLiving,
      taxRate: l.taxCost,
      environment: l.environmentalIndex,
      rent: l.rentCost,
      food: l.groceriesCost,
      healthcare: l.healthcareCost,
      transport: l.transportationCost,
      safetyRank: l.womenSafetyRank,
      weatherRank: l.weatherRank
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}


