import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoMuoiBonComponent} from './mau-so-muoi-bon.component';

describe('MauSoMuoiBonComponent', () => {
  let component: MauSoMuoiBonComponent;
  let fixture: ComponentFixture<MauSoMuoiBonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoMuoiBonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMuoiBonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
