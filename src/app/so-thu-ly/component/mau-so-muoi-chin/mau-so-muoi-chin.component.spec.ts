import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MauSoMuoiChinComponent } from './mau-so-muoi-chin.component';

describe('MauSoMuoiChinComponent', () => {
  let component: MauSoMuoiChinComponent;
  let fixture: ComponentFixture<MauSoMuoiChinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MauSoMuoiChinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMuoiChinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
