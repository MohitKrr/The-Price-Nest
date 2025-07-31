import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
  expandedFaqs = new Set<number>();

  ShowFaq(index: number) {
    if (this.expandedFaqs.has(index)) {
      this.expandedFaqs.delete(index);
    } else {
      this.expandedFaqs.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedFaqs.has(index);
  }
}
