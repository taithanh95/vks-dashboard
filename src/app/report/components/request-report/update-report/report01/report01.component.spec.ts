import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Report01Component } from './report01.component';

describe('Report01Component', () => {
  let component: Report01Component;
  let fixture: ComponentFixture<Report01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Report01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Report01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
