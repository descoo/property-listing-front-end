import { TestBed } from '@angular/core/testing';

import { MyAdvertsGuard } from './my-adverts.guard';

describe('MyAdvertsGuard', () => {
  let guard: MyAdvertsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MyAdvertsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
