import { TestBed } from '@angular/core/testing';

import { OrmService } from './orm.service';

describe('OrmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrmService = TestBed.get(OrmService);
    expect(service).toBeTruthy();
  });
});
