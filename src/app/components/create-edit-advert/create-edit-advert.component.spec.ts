import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditAdvertComponent } from './create-edit-advert.component';

describe('CreateEditAdvertComponent', () => {
  let component: CreateEditAdvertComponent;
  let fixture: ComponentFixture<CreateEditAdvertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEditAdvertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditAdvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
