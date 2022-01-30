import { TestBed } from '@angular/core/testing';

import { JadwalapiService } from './jadwalapi.service';

describe('JadwalapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JadwalapiService = TestBed.get(JadwalapiService);
    expect(service).toBeTruthy();
  });
});
