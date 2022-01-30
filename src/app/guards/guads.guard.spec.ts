import { TestBed, async, inject } from '@angular/core/testing';

import { GuadsGuard } from './guads.guard';

describe('GuadsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuadsGuard]
    });
  });

  it('should ...', inject([GuadsGuard], (guard: GuadsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
