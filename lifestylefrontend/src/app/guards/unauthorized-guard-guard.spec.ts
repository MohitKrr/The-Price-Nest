import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { unauthorizedGuardGuard } from './unauthorized-guard-guard';

describe('unauthorizedGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unauthorizedGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
