import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoMotComponent} from './mau-so-mot.component';

describe('MauSoMotComponent', () => {
  let component: MauSoMotComponent;
  let fixture: ComponentFixture<MauSoMotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoMotComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
