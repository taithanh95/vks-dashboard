import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRequestReportComponent } from './update-request-report.component';

describe('UpdateRequestReportComponent', () => {
  let component: UpdateRequestReportComponent;
  let fixture: ComponentFixture<UpdateRequestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateRequestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
