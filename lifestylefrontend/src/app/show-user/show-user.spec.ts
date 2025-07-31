import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUser } from './show-user';

describe('ShowUser', () => {
  let component: ShowUser;
  let fixture: ComponentFixture<ShowUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
