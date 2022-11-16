import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MauSoSauComponent} from './mau-so-sau.component';

describe('MauSoSauComponent', () => {
  let component: MauSoSauComponent;
  let fixture: ComponentFixture<MauSoSauComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MauSoSauComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoSauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
