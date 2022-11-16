import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoHaiBayComponent} from './mau-so-hai-bay.component';

describe('MauSoHaiBayComponent', () => {
  let component: MauSoHaiBayComponent;
  let fixture: ComponentFixture<MauSoHaiBayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoHaiBayComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoHaiBayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
