import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailEmailComponent} from './detail-email.component';

describe('DetailEmailComponent', () => {
  let component: DetailEmailComponent;
  let fixture: ComponentFixture<DetailEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailEmailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
