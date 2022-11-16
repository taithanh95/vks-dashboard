import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupUserRoleComponent } from './group-user-role.component';

describe('GroupUserRoleComponent', () => {
  let component: GroupUserRoleComponent;
  let fixture: ComponentFixture<GroupUserRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupUserRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
