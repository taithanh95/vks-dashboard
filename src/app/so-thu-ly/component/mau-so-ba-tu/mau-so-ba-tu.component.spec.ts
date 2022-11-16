import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MauSoBaTuComponent } from './mau-so-ba-tu.component';

describe('MauSoBaTuComponent', () => {
  let component: MauSoBaTuComponent;
  let fixture: ComponentFixture<MauSoBaTuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MauSoBaTuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoBaTuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
