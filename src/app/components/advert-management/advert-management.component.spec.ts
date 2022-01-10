import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertManagementComponent } from './advert-management.component';

describe('AdvertManagementComponent', () => {
  let component: AdvertManagementComponent;
  let fixture: ComponentFixture<AdvertManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvertManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
