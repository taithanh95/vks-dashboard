import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GopYComponent } from './gop-y.component';

describe('GopYComponent', () => {
  let component: GopYComponent;
  let fixture: ComponentFixture<GopYComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GopYComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GopYComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
