import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoMuoiComponent} from './mau-so-muoi.component';

describe('MauSoMuoiComponent', () => {
  let component: MauSoMuoiComponent;
  let fixture: ComponentFixture<MauSoMuoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoMuoiComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMuoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
