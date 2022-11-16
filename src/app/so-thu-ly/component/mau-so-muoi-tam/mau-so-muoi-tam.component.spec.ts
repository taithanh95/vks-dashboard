import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoMuoiTamComponent} from './mau-so-muoi-tam.component';

describe('MauSoMuoiTamComponent', () => {
  let component: MauSoMuoiTamComponent;
  let fixture: ComponentFixture<MauSoMuoiTamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoMuoiTamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMuoiTamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
