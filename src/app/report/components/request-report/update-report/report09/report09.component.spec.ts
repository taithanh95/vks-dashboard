import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Report09Component } from './report09.component';

describe('Report09Component', () => {
  let component: Report09Component;
  let fixture: ComponentFixture<Report09Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Report09Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Report09Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
