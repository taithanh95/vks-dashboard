import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateApproveGopYComponent } from './update-approve-gop-y.component';

describe('UpdateApproveGopYComponent', () => {
  let component: UpdateApproveGopYComponent;
  let fixture: ComponentFixture<UpdateApproveGopYComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateApproveGopYComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateApproveGopYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
