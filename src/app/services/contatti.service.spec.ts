import { TestBed } from '@angular/core/testing';

import { ContattiService } from './contatti.service';

describe('ContattiService', () => {
  let service: ContattiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContattiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
