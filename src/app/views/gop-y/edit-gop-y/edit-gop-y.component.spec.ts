import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGopYComponent } from './edit-gop-y.component';

describe('EditGopYComponent', () => {
  let component: EditGopYComponent;
  let fixture: ComponentFixture<EditGopYComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGopYComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGopYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
