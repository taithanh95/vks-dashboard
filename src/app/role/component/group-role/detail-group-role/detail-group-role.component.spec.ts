import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailGroupRoleComponent} from './detail-group-role.component';

describe('DetailGroupRoleComponent', () => {
  let component: DetailGroupRoleComponent;
  let fixture: ComponentFixture<DetailGroupRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailGroupRoleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailGroupRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
