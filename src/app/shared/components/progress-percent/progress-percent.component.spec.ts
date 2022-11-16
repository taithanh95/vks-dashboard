import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressPercentComponent } from './progress-percent.component';

describe('ProgressbarComponent', () => {
  let component: ProgressPercentComponent;
  let fixture: ComponentFixture<ProgressPercentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressPercentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressPercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
