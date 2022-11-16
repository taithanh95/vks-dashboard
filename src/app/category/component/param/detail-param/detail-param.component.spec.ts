import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailParamComponent} from './detail-param.component';

describe('DetailParamComponent', () => {
  let component: DetailParamComponent;
  let fixture: ComponentFixture<DetailParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailParamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
