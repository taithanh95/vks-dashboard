import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailVillageComponent} from './detail-village.component';

describe('DetailVillageComponent', () => {
  let component: DetailVillageComponent;
  let fixture: ComponentFixture<DetailVillageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailVillageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailVillageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
