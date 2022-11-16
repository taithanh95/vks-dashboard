import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoMuoiNamComponent} from './mau-so-muoi-nam.component';

describe('MauSoMuoiNamComponent', () => {
  let component: MauSoMuoiNamComponent;
  let fixture: ComponentFixture<MauSoMuoiNamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoMuoiNamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMuoiNamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
