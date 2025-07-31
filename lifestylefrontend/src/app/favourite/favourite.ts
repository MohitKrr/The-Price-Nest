import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavouriteService } from '../Component/services/favourite-service';
import { FavouriteModel } from '../Component/Models/favourite-model';
import { AuthService } from '../services/auth-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LifestyleService } from '../Component/services/lifestyle-service';
import { LifestyleModel } from '../Component/Models/lifestyle-model';
import { Userservice } from '../services/userservice';
import { CountryCard } from '../Component/country-card/country-card';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favourite',
  imports: [FormsModule, CommonModule, CountryCard],
  templateUrl: './favourite.html',
  styleUrl: './favourite.css'
})
export class Favourite implements OnInit, OnDestroy {
  favourites: FavouriteModel[] = [];
  favouriteCountries: any[] = [];
  username: string | null = null;
  userCountry: any = null;
  selectedCompareCountry: any = null;
  comparisonResult: any = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private favouriteService: FavouriteService,
    private authService: AuthService,
    private lifestyleService: LifestyleService,
    private userService: Userservice
  ) {}

  get userFavouriteNames(): string[] {
    return this.favourites.map(f => f.countryname || '').filter(name => name !== '');
  }

  mapToCardModel(country: LifestyleModel) {
    return {
      name: country.countryName,
      abbr: country.countryName.substring(0, 3).toUpperCase(),
      rank: country.globalRank,
      avgCost: country.averageCostOfLiving,
      taxRate: country.taxCost,
      environment: country.environmentalIndex,
      rent: country.rentCost,
      food: country.groceriesCost,
      healthcare: country.healthcareCost,
      transport: country.transportationCost,
      educationCost: country.educationCost,
      safetyRank: country.womenSafetyRank,
      weatherRank: country.weatherRank,
      crimeRate: country.crimeRate,
    };
  }

  ngOnInit() {
    this.subscriptions.push(
      this.authService.authData$.subscribe(data => {
        this.username = data.email; // Use email as username
        if (this.username) {
          this.loadUserFavourites();
          this.loadUserProfile();
        }
      })
    );

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
      this.favourites = favs;
      this.lifestyleService.getAll().subscribe(countries => {
        this.favouriteCountries = this.favourites
          .map(fav => {
            const c = countries.find(c => c.countryName === fav.countryname);
            return c ? this.mapToCardModel(c) : null;
          })
          .filter((c): c is any => !!c);
      });
    });
  }

  private loadUserProfile() {
    const email = this.authService.getEmailFromToken();
    if (email) {
      this.userService.getUserByEmail(email).subscribe(profile => {
        this.lifestyleService.getAll().subscribe(countries => {
          const userCountryObj = countries.find(c => c.countryName === profile.presentLivingCountry) || null;
          this.userCountry = userCountryObj ? this.mapToCardModel(userCountryObj) : null;
        });
      });
    }
  }

  compareCountries() {
    if (!this.userCountry || !this.selectedCompareCountry) return;
    // Use mapped property names
    const fields = [
      'taxRate', 'rank', 'rent', 'food', 'healthcare', 'educationCost', 'transport', 'safetyRank',
      'weatherRank', 'environment', 'crimeRate', 'avgCost'
    ];
    const result: any = {};
    for (const field of fields) {
      result[field] = {
        user: (this.userCountry as any)[field],
        favourite: (this.selectedCompareCountry as any)[field],
        diff: ((this.selectedCompareCountry as any)[field] ?? 0) - ((this.userCountry as any)[field] ?? 0)
      };
    }
    this.comparisonResult = result;
  }

  getRecommendedCountryName(): string {
    if (!this.comparisonResult) return '';
    let userScore = 0;
    let favScore = 0;
    // Lower is better
    if (this.comparisonResult.averageCostOfLiving.user < this.comparisonResult.averageCostOfLiving.favourite) userScore++; else favScore++;
    if (this.comparisonResult.taxCost.user < this.comparisonResult.taxCost.favourite) userScore++; else favScore++;
    if (this.comparisonResult.rentCost.user < this.comparisonResult.rentCost.favourite) userScore++; else favScore++;
    if (this.comparisonResult.groceriesCost.user < this.comparisonResult.groceriesCost.favourite) userScore++; else favScore++;
    if (this.comparisonResult.restrauntCost.user < this.comparisonResult.restrauntCost.favourite) userScore++; else favScore++;
    if (this.comparisonResult.healthcareCost.user < this.comparisonResult.healthcareCost.favourite) userScore++; else favScore++;
    if (this.comparisonResult.educationCost.user < this.comparisonResult.educationCost.favourite) userScore++; else favScore++;
    if (this.comparisonResult.transportationCost.user < this.comparisonResult.transportationCost.favourite) userScore++; else favScore++;
    if (this.comparisonResult.crimeRate.user < this.comparisonResult.crimeRate.favourite) userScore++; else favScore++;
    // Higher is better
    if (this.comparisonResult.environment.user > this.comparisonResult.environment.favourite) userScore++; else favScore++;
    if (this.comparisonResult.womenSafetyRank.user > this.comparisonResult.womenSafetyRank.favourite) userScore++; else favScore++;
    if (this.comparisonResult.weatherRank.user > this.comparisonResult.weatherRank.favourite) userScore++; else favScore++;
    if (userScore > favScore && this.userCountry) return this.userCountry.name || this.userCountry.countryName;
    if (favScore > userScore && this.selectedCompareCountry) return this.selectedCompareCountry.name || this.selectedCompareCountry.countryName;
    return 'Both are equally good';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
