import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoMuoiHaiComponent} from './mau-so-muoi-hai.component';

describe('MauSoMuoiHaiComponent', () => {
  let component: MauSoMuoiHaiComponent;
  let fixture: ComponentFixture<MauSoMuoiHaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoMuoiHaiComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMuoiHaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
