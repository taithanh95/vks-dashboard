import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoHaiComponent} from './mau-so-hai.component';

describe('MauSoHaiComponent', () => {
  let component: MauSoHaiComponent;
  let fixture: ComponentFixture<MauSoHaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoHaiComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoHaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
