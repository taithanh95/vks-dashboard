import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoHaiTuComponent} from './mau-so-hai-tu.component';

describe('MauSoHaiTuComponent', () => {
  let component: MauSoHaiTuComponent;
  let fixture: ComponentFixture<MauSoHaiTuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoHaiTuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoHaiTuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
