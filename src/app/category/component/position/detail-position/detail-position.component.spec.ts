import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailPositionComponent} from './detail-position.component';

describe('DetailPositionComponent', () => {
  let component: DetailPositionComponent;
  let fixture: ComponentFixture<DetailPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailPositionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
