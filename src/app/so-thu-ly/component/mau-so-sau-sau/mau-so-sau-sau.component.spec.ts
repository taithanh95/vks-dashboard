import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MauSoSauSauComponent } from './mau-so-sau-sau.component';

describe('MauSoSauSauComponent', () => {
  let component: MauSoSauSauComponent;
  let fixture: ComponentFixture<MauSoSauSauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MauSoSauSauComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoSauSauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
