import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoHaiSauComponent} from './mau-so-hai-sau.component';

describe('MauSoHaiSauComponent', () => {
  let component: MauSoHaiSauComponent;
  let fixture: ComponentFixture<MauSoHaiSauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoHaiSauComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoHaiSauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
