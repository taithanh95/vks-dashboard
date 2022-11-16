import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoHaiChinComponent} from './mau-so-hai-chin.component';

describe('MauSoHaiChinComponent', () => {
  let component: MauSoHaiChinComponent;
  let fixture: ComponentFixture<MauSoHaiChinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoHaiChinComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoHaiChinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
