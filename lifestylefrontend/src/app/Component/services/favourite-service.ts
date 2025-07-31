import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { FavouriteModel } from '../Models/favourite-model';

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  private apiUrl = 'http://localhost:5276/api/Favourite';
  private favouritesUpdated = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAllFavourites(): Observable<FavouriteModel[]> {
    return this.http.get<FavouriteModel[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getFavouritesByUsername(username: string): Observable<FavouriteModel[]> {
    return this.http.get<FavouriteModel[]>(`${this.apiUrl}/user/${username}`, { headers: this.getHeaders() });
  }

  addFavourite(favourite: FavouriteModel): Observable<FavouriteModel> {
    return this.http.post<FavouriteModel>(this.apiUrl, favourite, { headers: this.getHeaders() });
  }

  deleteFavourite(countryName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${encodeURIComponent(countryName)}`, { headers: this.getHeaders() });
  }

  // Method to notify that favourites have been updated
  notifyFavouritesUpdated() {
    this.favouritesUpdated.next();
  }

  // Observable to listen for favourites updates
  get favouritesUpdated$(): Observable<void> {
    return this.favouritesUpdated.asObservable();
  }
} 