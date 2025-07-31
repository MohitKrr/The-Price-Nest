import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Lifestyles } from './lifestyles';

describe('Lifestyles', () => {
  let component: Lifestyles;
  let fixture: ComponentFixture<Lifestyles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lifestyles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Lifestyles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
