import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoHaiBaComponent} from './mau-so-hai-ba.component';

describe('MauSoHaiBaComponent', () => {
  let component: MauSoHaiBaComponent;
  let fixture: ComponentFixture<MauSoHaiBaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoHaiBaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoHaiBaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
