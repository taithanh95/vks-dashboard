import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MauSoMuoiBaComponent } from './mau-so-muoi-ba.component';

describe('MauSoMuoiBaComponent', () => {
  let component: MauSoMuoiBaComponent;
  let fixture: ComponentFixture<MauSoMuoiBaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MauSoMuoiBaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MauSoMuoiBaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
