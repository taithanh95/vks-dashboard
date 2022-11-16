import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GiaiQuyetTinBaoMauSoBonComponent} from './giai-quyet-tin-bao-mau-so-bon.component';

describe('GiaiQuyetTinBaoMauSoBonComponent', () => {
  let component: GiaiQuyetTinBaoMauSoBonComponent;
  let fixture: ComponentFixture<GiaiQuyetTinBaoMauSoBonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GiaiQuyetTinBaoMauSoBonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiaiQuyetTinBaoMauSoBonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
