import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailProvinceComponent} from './detail-province.component';

describe('DetailProvinceComponent', () => {
  let component: DetailProvinceComponent;
  let fixture: ComponentFixture<DetailProvinceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailProvinceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProvinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
