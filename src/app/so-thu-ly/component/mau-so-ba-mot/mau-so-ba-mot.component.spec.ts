import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MauSoBaMotComponent } from './mau-so-ba-mot.component';

describe('MauSoBaMotComponent', () => {
  let component: MauSoBaMotComponent;
  let fixture: ComponentFixture<MauSoBaMotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MauSoBaMotComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoBaMotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
