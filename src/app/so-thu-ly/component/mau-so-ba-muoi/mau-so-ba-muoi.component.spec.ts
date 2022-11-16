import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoBaMuoiComponent} from './mau-so-ba-muoi.component';

describe('MauSoBaMuoiComponent', () => {
  let component: MauSoBaMuoiComponent;
  let fixture: ComponentFixture<MauSoBaMuoiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoBaMuoiComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoBaMuoiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
