import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoMuoiBayComponent} from './mau-so-muoi-bay.component';

describe('MauSoMuoiBayComponent', () => {
  let component: MauSoMuoiBayComponent;
  let fixture: ComponentFixture<MauSoMuoiBayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoMuoiBayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMuoiBayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
