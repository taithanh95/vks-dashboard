import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MauSoBaSauComponent } from './mau-so-ba-sau.component';

describe('MauSoBaSauComponent', () => {
  let component: MauSoBaSauComponent;
  let fixture: ComponentFixture<MauSoBaSauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MauSoBaSauComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoBaSauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
