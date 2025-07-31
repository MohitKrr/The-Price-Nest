import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth-service';


@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule], 
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit  { 
  isLoggedIn: boolean = false;
  userEmail: string | null = null;
  private routerSub!: Subscription;
  show = false;
  isMobileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit() {
    this.authService.authData$.subscribe(data => {
      this.isLoggedIn = data.isLoggedIn;
      this.userEmail = data.email;
    });

    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.show = false; 
        this.closeMobileMenu();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.icon-container');
    if (!clickedInside) {
      this.show = false; // Close if click is outside profile icon/dropdown
    }
  }

  toggle() {
    this.show = !this.show;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.icon-container')) {
      this.show = false;
    }
  }

  goToProfile() {
    this.show = false;
    this.router.navigate(['/profile']); // Change to '/edituser' if needed
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }
}
