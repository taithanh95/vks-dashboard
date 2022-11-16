import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MauSoBaNamComponent } from './mau-so-ba-nam.component';

describe('MauSoBaNamComponent', () => {
  let component: MauSoBaNamComponent;
  let fixture: ComponentFixture<MauSoBaNamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MauSoBaNamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoBaNamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
