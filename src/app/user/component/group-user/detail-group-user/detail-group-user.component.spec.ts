import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailGroupUserComponent } from './detail-group-user.component';

describe('DetailGroupUserComponent', () => {
  let component: DetailGroupUserComponent;
  let fixture: ComponentFixture<DetailGroupUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailGroupUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailGroupUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
