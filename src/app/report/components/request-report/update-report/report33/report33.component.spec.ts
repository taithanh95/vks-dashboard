import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Report33Component } from './report33.component';

describe('Report33Component', () => {
  let component: Report33Component;
  let fixture: ComponentFixture<Report33Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Report33Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Report33Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
