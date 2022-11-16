import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoHaiNamComponent} from './mau-so-hai-nam.component';

describe('MauSoHaiNamComponent', () => {
  let component: MauSoHaiNamComponent;
  let fixture: ComponentFixture<MauSoHaiNamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoHaiNamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoHaiNamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
