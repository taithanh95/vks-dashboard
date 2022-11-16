import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MauSoBaBaComponent } from './mau-so-ba-ba.component';

describe('MauSoBaBaComponent', () => {
  let component: MauSoBaBaComponent;
  let fixture: ComponentFixture<MauSoBaBaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MauSoBaBaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoBaBaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
