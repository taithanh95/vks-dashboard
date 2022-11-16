import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoNamComponent} from './mau-so-nam.component';

describe('MauSoNamComponent', () => {
  let component: MauSoNamComponent;
  let fixture: ComponentFixture<MauSoNamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoNamComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoNamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
