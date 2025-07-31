import { Component } from '@angular/core';
import { CountryCard } from '../country-card/country-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [CountryCard, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  scrollToCardsGrid() {
    const element = document.getElementById('cardsGridSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  
  
}
