import { TestBed } from '@angular/core/testing';

import { KlikkihallintaService } from './klikkihallinta.service';

describe('KlikkihallintaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KlikkihallintaService = TestBed.get(KlikkihallintaService);
    expect(service).toBeTruthy();
  });
});
