import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comparision } from './comparision';

describe('Comparision', () => {
  let component: Comparision;
  let fixture: ComponentFixture<Comparision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comparision]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comparision);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
