import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoHaiMotComponent} from './mau-so-hai-mot.component';

describe('MauSoHaiMotComponent', () => {
  let component: MauSoHaiMotComponent;
  let fixture: ComponentFixture<MauSoHaiMotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoHaiMotComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoHaiMotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
