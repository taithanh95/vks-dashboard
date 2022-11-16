import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoMuoiSauComponent} from './mau-so-muoi-sau.component';

describe('MauSoMuoiSauComponent', () => {
  let component: MauSoMuoiSauComponent;
  let fixture: ComponentFixture<MauSoMuoiSauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoMuoiSauComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMuoiSauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
