import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGopYComponent } from './create-gop-y.component';

describe('CreateGopYComponent', () => {
  let component: CreateGopYComponent;
  let fixture: ComponentFixture<CreateGopYComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGopYComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGopYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
