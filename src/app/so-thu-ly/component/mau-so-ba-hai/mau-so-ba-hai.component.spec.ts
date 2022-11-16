import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MauSoBaHaiComponent } from './mau-so-ba-hai.component';

describe('MauSoBaHaiComponent', () => {
  let component: MauSoBaHaiComponent;
  let fixture: ComponentFixture<MauSoBaHaiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MauSoBaHaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoBaHaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
