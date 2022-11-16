import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailCommuneComponent} from './detail-commune.component';

describe('DetailCommuneComponent', () => {
  let component: DetailCommuneComponent;
  let fixture: ComponentFixture<DetailCommuneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailCommuneComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCommuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
