import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoChinComponent} from './mau-so-chin.component';

describe('MauSoChinComponent', () => {
  let component: MauSoChinComponent;
  let fixture: ComponentFixture<MauSoChinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoChinComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoChinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
