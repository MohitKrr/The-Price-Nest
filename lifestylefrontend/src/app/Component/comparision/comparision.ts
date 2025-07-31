import { Component, OnInit } from '@angular/core';
import { LifestyleService } from '../services/lifestyle-service';
import { LifestyleModel } from '../Models/lifestyle-model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comparision',
  templateUrl: './comparision.html',
  styleUrls: ['./comparision.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink]
})
export class Comparision implements OnInit {
  countries: LifestyleModel[] = [];
  selectedCountry1?: LifestyleModel;
  selectedCountry2?: LifestyleModel;
  recommendedCountry?: LifestyleModel;

  constructor(private lifestyleService: LifestyleService) {}

  ngOnInit(): void {
    this.lifestyleService.getAll().subscribe(data => {
      this.countries = data.filter(
        (item, index, self) => index === self.findIndex(t => t.countryName === item.countryName)
      );
    });
  }

  onSelectCountry1(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCountry1 = this.countries.find(c => c.countryName === value);
    this.determineRecommendation();
  }

  onSelectCountry2(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCountry2 = this.countries.find(c => c.countryName === value);
    this.determineRecommendation();
  }

  getAbbr(countryName: string | undefined): string {
    return countryName ? countryName.slice(0, 3).toUpperCase() : '';
  }

  getValueClass(value1: number, value2: number, type: string): string {
    if (value1 === value2) return 'value-neutral';
    
    switch (type) {
      case 'cost':
        // For costs, lower is better (green), higher is worse (red)
        return value1 < value2 ? 'value-better' : 'value-worse';
      case 'rank':
        // For ranks, lower is better (green), higher is worse (red)
        return value1 < value2 ? 'value-better' : 'value-worse';
      case 'environment':
        // For environmental index, higher is better (green), lower is worse (red)
        return value1 > value2 ? 'value-better' : 'value-worse';
      case 'crime':
        // For crime rate, lower is better (green), higher is worse (red)
        return value1 < value2 ? 'value-better' : 'value-worse';
      default:
        return 'value-neutral';
    }
  }

  determineRecommendation(): void {
    this.recommendedCountry = undefined;

    if (this.selectedCountry1 && !this.selectedCountry2) {
      this.recommendedCountry = this.selectedCountry1;
    } else if (!this.selectedCountry1 && this.selectedCountry2) {
      this.recommendedCountry = this.selectedCountry2;
    } else if (this.selectedCountry1 && this.selectedCountry2) {
      let score1 = 0;
      let score2 = 0;

      if (this.selectedCountry1.averageCostOfLiving < this.selectedCountry2.averageCostOfLiving) score1 += 3;
      else if (this.selectedCountry2.averageCostOfLiving < this.selectedCountry1.averageCostOfLiving) score2 += 3;

      if (this.selectedCountry1.globalRank < this.selectedCountry2.globalRank) score1 += 2;
      else if (this.selectedCountry2.globalRank < this.selectedCountry1.globalRank) score2 += 2;

      if (this.selectedCountry1.taxCost < this.selectedCountry2.taxCost) score1 += 1;
      else if (this.selectedCountry2.taxCost < this.selectedCountry1.taxCost) score2 += 1;

      if (this.selectedCountry1.environmentalIndex > this.selectedCountry2.environmentalIndex) score1 += 1;
      else if (this.selectedCountry2.environmentalIndex > this.selectedCountry1.environmentalIndex) score2 += 1;

      if (this.selectedCountry1.crimeRate < this.selectedCountry2.crimeRate) score1 += 1;
      else if (this.selectedCountry2.crimeRate < this.selectedCountry1.crimeRate) score2 += 1;

      if (this.selectedCountry1.womenSafetyRank < this.selectedCountry2.womenSafetyRank) score1 += 1;
      else if (this.selectedCountry2.womenSafetyRank < this.selectedCountry1.womenSafetyRank) score2 += 1;

      this.recommendedCountry = score1 > score2 ? this.selectedCountry1 : this.selectedCountry2;
    }
  }

  getRankIcon(rank1: number, rank2: number): { [key: string]: boolean } {
    return {
      'fa-arrow-up green-arrow': rank1 > rank2,
      'fa-arrow-down red-arrow': rank1 < rank2,
      'fa-minus': rank1 === rank2
    };
  }

  getCostIcon(cost1: number, cost2: number): { [key: string]: boolean } {
    return {
      'fa-arrow-up red-arrow': cost1 < cost2,
      'fa-arrow-down green-arrow': cost1 > cost2,
      'fa-minus': cost1 === cost2
    };
  }

  getEnvironmentalIcon(env1: number, env2: number): { [key: string]: boolean } {
    return {
      'fa-arrow-up green-arrow': env1 > env2,
      'fa-arrow-down red-arrow': env1 < env2,
      'fa-minus': env1 === env2
    };
  }

  getCrimeIcon(crime1: number, crime2: number): { [key: string]: boolean } {
    return {
      'fa-arrow-up red-arrow': crime1 < crime2,
      'fa-arrow-down green-arrow': crime1 > crime2,
      'fa-minus': crime1 === crime2
    };
  }

  get recommendedCountryAbbr(): string {
    return this.getAbbr(this.recommendedCountry?.countryName);
  }

  get selectedCountry1Abbr(): string {
    return this.getAbbr(this.selectedCountry1?.countryName);
  }

  get selectedCountry2Abbr(): string {
    return this.getAbbr(this.selectedCountry2?.countryName);
  }
}
