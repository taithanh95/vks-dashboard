import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoHaiTamComponent} from './mau-so-hai-tam.component';

describe('MauSoHaiTamComponent', () => {
  let component: MauSoHaiTamComponent;
  let fixture: ComponentFixture<MauSoHaiTamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoHaiTamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoHaiTamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
