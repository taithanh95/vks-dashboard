import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailBankComponent} from './detail-bank.component';

describe('DetailBankComponent', () => {
  let component: DetailBankComponent;
  let fixture: ComponentFixture<DetailBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailBankComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
