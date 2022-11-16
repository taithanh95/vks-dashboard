import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRequestReportComponent } from './detail-request-report.component';

describe('DetailRequestReportComponent', () => {
  let component: DetailRequestReportComponent;
  let fixture: ComponentFixture<DetailRequestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRequestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
