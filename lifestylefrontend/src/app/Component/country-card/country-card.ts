import { Component, Input } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FavouriteService } from '../services/favourite-service';
import { AuthService } from '../../services/auth-service';
import { FavouriteModel } from '../Models/favourite-model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-country-card',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './country-card.html',
  styleUrl: './country-card.css'
})
export class CountryCard {
  @Input() country: any;
  @Input() showAddToFavourite: boolean = true;
  @Input() userFavourites: string[] = [];

  isHovered: boolean = false;
  isLoggedIn: boolean = false;
  username: string | null = null;
  private authSub!: Subscription;

  constructor(
    private favouriteService: FavouriteService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.authSub = this.authService.authData$.subscribe(data => {
      this.isLoggedIn = data.isLoggedIn;
      this.username = data.email; // Use email as username
    });
  }

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  get isAlreadyFavourite(): boolean {
    return this.userFavourites.includes(this.country.name);
  }

  addToFavourite() {
    if (!this.isLoggedIn) {
      this.toastService.warning('Please login to add favorites', 'Login Required');
      this.router.navigate(['/login']);
      return;
    }
    if (this.isAlreadyFavourite) return;
    
    const fav: FavouriteModel = {
      countryname: this.country.name
      // Don't send username - backend will extract it from JWT token
    };
    
    this.favouriteService.addFavourite(fav).subscribe({
      next: (response) => {
        this.toastService.success(`${this.country.name} added to favorites successfully!`, 'Favorite Added');
        // Notify other components that favourites have been updated
        this.favouriteService.notifyFavouritesUpdated();
      },
      error: (error) => {
        this.toastService.error(`Failed to add ${this.country.name} to favorites. Please try again.`, 'Error');
        console.error('Error adding favourite:', error);
      }
    });
  }

  removeFromFavourite() {
    if (!this.isLoggedIn) {
      this.toastService.warning('Please login to manage favorites', 'Login Required');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.isAlreadyFavourite) return;
    
    this.favouriteService.deleteFavourite(this.country.name).subscribe({
      next: () => {
        this.toastService.success(`${this.country.name} removed from favorites successfully!`, 'Favorite Removed');
        // Notify other components that favourites have been updated
        this.favouriteService.notifyFavouritesUpdated();
      },
      error: (error) => {
        this.toastService.error(`Failed to remove ${this.country.name} from favorites. Please try again.`, 'Error');
        console.error('Error removing favourite:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}