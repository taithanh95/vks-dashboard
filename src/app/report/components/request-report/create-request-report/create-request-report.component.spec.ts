import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequestReportComponent } from './create-request-report.component';

describe('CreateRequestReportComponent', () => {
  let component: CreateRequestReportComponent;
  let fixture: ComponentFixture<CreateRequestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRequestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
