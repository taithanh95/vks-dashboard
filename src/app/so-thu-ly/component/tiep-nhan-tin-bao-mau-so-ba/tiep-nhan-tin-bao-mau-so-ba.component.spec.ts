import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TiepNhanTinBaoMauSoBaComponent} from './tiep-nhan-tin-bao-mau-so-ba.component';

describe('TiepNhanTinBaoMauSoBaComponent', () => {
  let component: TiepNhanTinBaoMauSoBaComponent;
  let fixture: ComponentFixture<TiepNhanTinBaoMauSoBaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TiepNhanTinBaoMauSoBaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiepNhanTinBaoMauSoBaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
