import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Report08Component } from './report08.component';

describe('Report08Component', () => {
  let component: Report08Component;
  let fixture: ComponentFixture<Report08Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Report08Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Report08Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
