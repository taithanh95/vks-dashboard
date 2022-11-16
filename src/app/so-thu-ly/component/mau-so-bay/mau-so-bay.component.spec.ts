import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoBayComponent} from './mau-so-bay.component';

describe('MauSoBayComponent', () => {
  let component: MauSoBayComponent;
  let fixture: ComponentFixture<MauSoBayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoBayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoBayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
