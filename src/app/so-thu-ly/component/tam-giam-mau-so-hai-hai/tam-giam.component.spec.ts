import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TamGiamComponent} from './tam-giam.component';

describe('TamGiamComponent', () => {
  let component: TamGiamComponent;
  let fixture: ComponentFixture<TamGiamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TamGiamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamGiamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
