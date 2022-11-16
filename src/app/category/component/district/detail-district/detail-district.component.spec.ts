import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailDistrictComponent} from './detail-district.component';

describe('DetailDistrictComponent', () => {
  let component: DetailDistrictComponent;
  let fixture: ComponentFixture<DetailDistrictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailDistrictComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
