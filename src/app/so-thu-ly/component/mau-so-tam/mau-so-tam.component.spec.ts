import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoTamComponent} from './mau-so-tam.component';

describe('MauSoTamComponent', () => {
  let component: MauSoTamComponent;
  let fixture: ComponentFixture<MauSoTamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoTamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoTamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
