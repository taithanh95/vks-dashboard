import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoMuoiMotComponent} from './mau-so-muoi-mot.component';

describe('MauSoMuoiMotComponent', () => {
  let component: MauSoMuoiMotComponent;
  let fixture: ComponentFixture<MauSoMuoiMotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoMuoiMotComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMuoiMotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
