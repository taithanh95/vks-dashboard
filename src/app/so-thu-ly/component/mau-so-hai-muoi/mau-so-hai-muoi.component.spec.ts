import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MauSoHaiMuoiComponent } from './mau-so-hai-muoi.component';

describe('MauSoHaiMuoiComponent', () => {
  let component: MauSoHaiMuoiComponent;
  let fixture: ComponentFixture<MauSoHaiMuoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MauSoHaiMuoiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoHaiMuoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
